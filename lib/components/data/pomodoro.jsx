/**
 * Pomodoro Widget
 *
 * A focus / rest countdown displayed in the bar.
 *
 * Controls:
 * - Left click: start, pause or resume the current phase
 * - Right click: action strip inside the bar (pause, restart, skip, reset)
 * - Middle click or cmd/ctrl + click: skip to the next phase
 *
 * The action strip is rendered inside the bar rather than below it: Übersicht
 * owns the widget window and a widget cannot raise it above other applications,
 * so a popover hanging below the bar disappears behind any open window.
 *
 * The session is stored in localStorage under "sb_pomodoro" rather than in the
 * settings blob: simple-bar is rebuilt on yabai window, space and display events
 * (see Utils.softRefresh), which resets widget-local state and would restart the
 * timer every time a space changes.
 *
 * @module pomodoro
 */
import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import * as Icons from "../icons/icons.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { pomodoroStyles as styles } from "../../styles/components/data/pomodoro";

const { React } = Uebersicht;

const STORAGE_KEY = "sb_pomodoro";

const DEFAULT_REFRESH_FREQUENCY = 1000;
const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_REST_MINUTES = 5;
const DEFAULT_LONG_REST_MINUTES = 15;
const DEFAULT_LONG_REST_EVERY = 4;
const MAX_MINUTES = 180;
const MAX_LONG_REST_EVERY = 12;

// Ships with macOS, on the sealed system volume: no bundled asset needed
const FALLBACK_SOUND = "/System/Library/Sounds/Glass.aiff";
// Alert sound preference, so the widget reuses the sound the user already chose
const ALERT_SOUND_COMMAND = "defaults read -g com.apple.sound.beep.sound";

const FOCUS = "focus";
const REST = "rest";
const LONG_REST = "longrest";

const PHASE_CLASSES = {
  focus: "pomodoro--focus",
  rest: "pomodoro--rest",
  longrest: "pomodoro--longrest",
};

const PHASE_LABELS = {
  focus: "Focus",
  rest: "Rest",
  longrest: "Long rest",
};

// Action strip footprint: four 24px buttons, three 2px gaps and 10px of padding
const ACTIONS_WIDTH = 112;
// Gap between the action strip and the widget, and from the screen edge
const ACTIONS_MARGIN = 6;
// A middle click can be delivered both as click (data-widget's isMiddleClick
// branch) and as auxclick, so remember when the last skip happened: one physical
// click must not skip two phases
let lastSkipAt = 0;
const SKIP_DEBOUNCE = 250;

/**
 * Constrains a duration setting to a sane number of minutes.
 * @param {number|string} value - Raw setting value.
 * @param {number} fallback - Value used when the setting is not a number.
 * @returns {number} A number of minutes between 1 and MAX_MINUTES.
 */
function clampMinutes(value, fallback) {
  const minutes = parseInt(value, 10);
  if (isNaN(minutes)) return fallback;
  return Math.min(MAX_MINUTES, Math.max(1, minutes));
}

/**
 * Constrains the long rest cadence.
 * @param {number|string} value - Raw setting value.
 * @returns {number} 0 disables the long rest, otherwise 1 to MAX_LONG_REST_EVERY.
 */
function clampLongRestEvery(value) {
  const every = parseInt(value, 10);
  if (isNaN(every)) return DEFAULT_LONG_REST_EVERY;
  if (every <= 0) return 0;
  return Math.min(MAX_LONG_REST_EVERY, every);
}

/**
 * Builds the duration table from the widget settings.
 * @param {Object} options - The pomodoro widget options.
 * @returns {Object} Durations in milliseconds plus the long rest cadence.
 */
function getDurations(options) {
  return {
    focusMs:
      clampMinutes(options.focusDuration, DEFAULT_FOCUS_MINUTES) * 60 * 1000,
    restMs:
      clampMinutes(options.restDuration, DEFAULT_REST_MINUTES) * 60 * 1000,
    longRestMs:
      clampMinutes(options.longRestDuration, DEFAULT_LONG_REST_MINUTES) *
      60 *
      1000,
    longRestEvery: clampLongRestEvery(options.longRestEvery),
  };
}

/**
 * Returns the duration of a phase in milliseconds.
 * @param {string} phase - One of focus, rest, longrest.
 * @param {Object} durations - The duration table.
 * @returns {number} The phase duration in milliseconds.
 */
function getPhaseDuration(phase, durations) {
  if (phase === REST) return durations.restMs;
  if (phase === LONG_REST) return durations.longRestMs;
  return durations.focusMs;
}

/**
 * Computes the phase that follows the current one.
 * @param {string} phase - The current phase.
 * @param {number} completed - Focus sessions completed in the current set.
 * @param {Object} durations - The duration table.
 * @param {boolean} countFocus - Whether a finished focus session is counted.
 * @returns {Object} The next phase and the updated completed count.
 */
function getNextPhase(phase, completed, durations, countFocus) {
  if (phase !== FOCUS) return { phase: FOCUS, completed };
  const done = countFocus ? completed + 1 : completed;
  const { longRestEvery } = durations;
  const isLongRest =
    countFocus && longRestEvery > 0 && done % longRestEvery === 0;
  return { phase: isLongRest ? LONG_REST : REST, completed: done };
}

/**
 * Formats a duration as MM:SS.
 * @param {number} milliseconds - Duration in milliseconds.
 * @returns {string} The formatted duration.
 */
function formatTime(milliseconds) {
  const total = Math.max(0, Math.round(milliseconds / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Builds a fresh, idle session.
 * @param {Object} durations - The duration table.
 * @returns {Object} The idle session.
 */
function createIdleSession(durations) {
  return {
    phase: FOCUS,
    started: false,
    running: false,
    endsAt: null,
    pausedMs: durations.focusMs,
    completed: 0,
    announcedAt: 0,
  };
}

/**
 * Reads the stored session, if any.
 * @returns {Object|null} The stored session or null.
 */
function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    if (!stored || typeof stored !== "object") return null;
    return stored;
  } catch {
    return null;
  }
}

/**
 * Writes the session to localStorage.
 * @param {Object} session - The session to store.
 */
function writeStoredSession(session) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage can be unavailable or full: the widget keeps running regardless.
  }
}

/**
 * Restores the session on mount, reconciling a phase that ended while the bar
 * was not running. A session more than one whole phase overdue starts over.
 * @param {Object} durations - The duration table.
 * @returns {Object} The restored session.
 */
function createSession(durations) {
  const fallback = createIdleSession(durations);
  const stored = readStoredSession();
  if (!stored) return fallback;

  const phase = PHASE_LABELS[stored.phase] ? stored.phase : FOCUS;
  const completed = Number.isFinite(stored.completed) ? stored.completed : 0;
  const announcedAt = Number.isFinite(stored.announcedAt)
    ? stored.announcedAt
    : 0;
  const endsAt = Number.isFinite(stored.endsAt) ? stored.endsAt : null;
  const pausedMs = Number.isFinite(stored.pausedMs) ? stored.pausedMs : null;
  const now = Date.now();

  if (stored.running && endsAt !== null) {
    if (endsAt > now) {
      return {
        phase,
        started: true,
        running: true,
        endsAt,
        pausedMs: null,
        completed,
        announcedAt,
      };
    }
    if (now - endsAt > getPhaseDuration(phase, durations)) return fallback;
    const next = getNextPhase(phase, completed, durations, true);
    return {
      phase: next.phase,
      started: true,
      running: true,
      endsAt: now + getPhaseDuration(next.phase, durations),
      pausedMs: null,
      completed: next.completed,
      // The boundary was crossed while the bar was down: do not announce it now
      announcedAt: endsAt,
    };
  }

  if (!stored.running && pausedMs !== null && pausedMs > 0) {
    return {
      phase,
      started: true,
      running: false,
      endsAt: null,
      // A hand-edited or corrupt value must not render as a five digit clock
      pausedMs: Math.min(pausedMs, getPhaseDuration(phase, durations)),
      completed,
      announcedAt,
    };
  }

  return fallback;
}

/**
 * Pomodoro widget component.
 * @returns {JSX.Element|null} The rendered widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings, pushMissive } = useSimpleBarContext();
  const { widgets, pomodoroWidgetOptions } = settings;
  const { pomodoroWidget } = widgets;
  const {
    refreshFrequency,
    showOnDisplay,
    showIcon,
    autoStartNext,
    playSound,
    showNotification,
    showPhaseLabel,
    showSessionDots,
    focusDuration,
    restDuration,
    longRestDuration,
    longRestEvery,
  } = pomodoroWidgetOptions;

  // Determine if the widget should be visible on the current display
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && pomodoroWidget;

  const durations = React.useMemo(
    () =>
      getDurations({
        focusDuration,
        restDuration,
        longRestDuration,
        longRestEvery,
      }),
    [focusDuration, restDuration, longRestDuration, longRestEvery],
  );

  const refresh = React.useMemo(
    () => Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  const [session, setSession] = React.useState(() => createSession(durations));
  const [now, setNow] = React.useState(() => Date.now());
  const [actionsPosition, setActionsPosition] = React.useState(null);
  const [ended, setEnded] = React.useState(false);

  const wrapperRef = React.useRef();
  const actionsRef = React.useRef();
  const soundRef = React.useRef(FALLBACK_SOUND);
  // Measured once the strip has been rendered, so the placement clamp cannot
  // drift from the stylesheet
  const actionsWidthRef = React.useRef(ACTIONS_WIDTH);

  React.useEffect(() => {
    writeStoredSession(session);
  }, [session]);

  React.useEffect(() => {
    if (!visible) return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), refresh);
    return () => window.clearInterval(interval);
  }, [visible, refresh]);

  // Clear the phase end highlight after a moment
  React.useEffect(() => {
    if (!ended) return undefined;
    const timeout = window.setTimeout(() => setEnded(false), 900);
    return () => window.clearTimeout(timeout);
  }, [ended]);

  // Remember the rendered strip width for the placement clamp
  React.useLayoutEffect(() => {
    if (actionsPosition && actionsRef.current) {
      actionsWidthRef.current = actionsRef.current.offsetWidth;
    }
  }, [actionsPosition]);

  // Resolve the alert sound the user configured, once, instead of on every chime
  React.useEffect(() => {
    if (!visible || !playSound) return undefined;
    let cancelled = false;
    const resolveSound = async () => {
      try {
        const output = await Uebersicht.run(ALERT_SOUND_COMMAND);
        const file = String(output || "").trim();
        if (!cancelled && file) {
          soundRef.current = file.replace(/["$`\\]/g, "\\$&");
        }
      } catch {
        // Preference absent: keep the fallback sound
      }
    };
    resolveSound();
    return () => {
      cancelled = true;
    };
  }, [visible, playSound]);

  /**
   * Plays the phase end sound, falling back to the system beep.
   */
  const playChime = React.useCallback(async () => {
    try {
      await Uebersicht.run(`afplay "${soundRef.current}"`);
    } catch {
      try {
        await Uebersicht.run("osascript -e 'beep'");
      } catch {
        // Nothing can play: stay silent
      }
    }
  }, []);

  /**
   * Announces the end of a phase with a sound and/or a notification.
   * @param {string} from - The phase that just ended.
   * @param {string} to - The phase that starts.
   * @param {number} duration - The duration of the new phase in milliseconds.
   */
  const announce = React.useCallback(
    (from, to, duration) => {
      if (playSound) playChime();
      if (!showNotification) return;
      const message =
        from === FOCUS
          ? `Focus finished - ${PHASE_LABELS[to].toLowerCase()} for ${formatTime(duration)}`
          : `${PHASE_LABELS[from]} over - back to focus for ${formatTime(duration)}`;
      Utils.notification(message, pushMissive, { side: "right", delay: 5000 });
    },
    [playSound, showNotification, pushMissive, playChime],
  );

  /**
   * Flags the widget as just having changed phase.
   */
  const flash = React.useCallback(() => {
    setEnded(true);
  }, []);

  // Phase end: advance once the deadline is passed
  React.useEffect(() => {
    if (!visible || !session.running || !session.endsAt) return;
    if (session.endsAt > now) return;

    const next = getNextPhase(session.phase, session.completed, durations, true);
    const duration = getPhaseDuration(next.phase, durations);
    const shouldAnnounce = session.announcedAt !== session.endsAt;
    // Every display shares the stored session, so claim the boundary before
    // announcing to keep a second bar from chiming for the same one
    const stored = readStoredSession();
    const alreadyAnnounced = Boolean(
      stored && stored.announcedAt === session.endsAt,
    );

    const claimed = {
      phase: next.phase,
      started: true,
      running: Boolean(autoStartNext),
      endsAt: autoStartNext ? Date.now() + duration : null,
      pausedMs: autoStartNext ? null : duration,
      completed: next.completed,
      announcedAt: session.endsAt,
    };

    if (shouldAnnounce && !alreadyAnnounced) {
      writeStoredSession(claimed);
      announce(session.phase, next.phase, duration);
    }

    setSession(claimed);
    flash();
  }, [
    visible,
    session,
    now,
    durations,
    autoStartNext,
    announce,
    flash,
  ]);

  // Dismiss the action strip on an outside click, on losing focus, or Escape.
  // This listens for click rather than mousedown on purpose: WebKit dispatches
  // contextmenu *before* the trailing mousedown of the same right click, so a
  // mousedown dismisser closed the strip in the same gesture that opened it.
  React.useEffect(() => {
    if (!actionsPosition) return undefined;
    const onClickOutside = (e) => {
      if (actionsRef.current && actionsRef.current.contains(e.target)) return;
      setActionsPosition(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActionsPosition(null);
    };
    const onBlur = () => setActionsPosition(null);
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onBlur);
    };
  }, [actionsPosition]);

  /**
   * Starts, pauses or resumes the countdown.
   * @param {Event} e - The originating event.
   */
  const toggle = React.useCallback(
    (e) => {
      if (e) Utils.clickEffect(e);
      setSession((current) => {
        if (current.running) {
          const remaining = Math.max(
            0,
            (current.endsAt || Date.now()) - Date.now(),
          );
          return {
            ...current,
            running: false,
            endsAt: null,
            pausedMs: remaining,
          };
        }
        const configured = getPhaseDuration(current.phase, durations);
        // A pause taken in the last milliseconds of a phase must not resume a
        // zero length phase, and a pause stored before a settings change must
        // not run longer than the phase it was held in
        const duration =
          current.pausedMs > 0
            ? Math.min(current.pausedMs, configured)
            : configured;
        return {
          ...current,
          started: true,
          running: true,
          endsAt: Date.now() + duration,
          pausedMs: null,
        };
      });
    },
    [durations],
  );

  /**
   * Restarts the current phase from the beginning.
   * @param {Event} e - The originating event.
   */
  const restartPhase = React.useCallback(
    (e) => {
      if (e) Utils.clickEffect(e);
      setSession((current) => ({
        ...current,
        started: true,
        running: true,
        endsAt: Date.now() + getPhaseDuration(current.phase, durations),
        pausedMs: null,
      }));
    },
    [durations],
  );

  /**
   * Skips to the next phase without counting the current one as completed.
   * @param {Event} e - The originating event.
   */
  const skipPhase = React.useCallback(
    (e) => {
      const timestamp = Date.now();
      if (timestamp - lastSkipAt < SKIP_DEBOUNCE) return;
      lastSkipAt = timestamp;
      if (e) Utils.clickEffect(e);
      setSession((current) => {
        const next = getNextPhase(
          current.phase,
          current.completed,
          durations,
          false,
        );
        const duration = getPhaseDuration(next.phase, durations);
        return {
          phase: next.phase,
          completed: next.completed,
          started: true,
          running: Boolean(autoStartNext),
          endsAt: autoStartNext ? Date.now() + duration : null,
          pausedMs: autoStartNext ? null : duration,
          announcedAt: 0,
        };
      });
      flash();
    },
    [durations, autoStartNext, flash],
  );

  /**
   * Skips to the next phase on a middle click. data-widget.jsx only listens to
   * click events, and a middle click fires auxclick, so the widget handles it
   * here instead of relying on onMiddleClick.
   * @param {MouseEvent} e - The auxclick event.
   */
  const onAuxClick = React.useCallback(
    (e) => {
      if (e.button !== 1) return;
      skipPhase(e);
    },
    [skipPhase],
  );

  /**
   * Resets the whole session back to an idle focus phase.
   * @param {Event} e - The originating event.
   */
  const resetSession = React.useCallback(
    (e) => {
      if (e) Utils.clickEffect(e);
      setSession(createIdleSession(durations));
    },
    [durations],
  );

  /**
   * Opens the action strip inside the bar, next to the widget. It has to stay
   * within the bar strip: Übersicht owns the widget window and a widget cannot
   * raise it above other applications, so anything hanging below the bar is
   * covered as soon as a window is open on the current workspace.
   * @param {MouseEvent} e - The context menu event.
   */
  const openActions = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect =
      wrapperRef.current && wrapperRef.current.getBoundingClientRect();
    if (!rect) return;
    // Prefer the space left of the pill, and fall back to its right when the
    // widget sits too close to the left edge of the screen
    const stripWidth = actionsWidthRef.current;
    const fitsOnTheLeft =
      rect.left - ACTIONS_MARGIN >= stripWidth + ACTIONS_MARGIN;
    const wantedRight = fitsOnTheLeft
      ? window.innerWidth - rect.left + ACTIONS_MARGIN
      : window.innerWidth - rect.right - ACTIONS_MARGIN - stripWidth;
    // right is measured from the right edge of the screen: keep the whole strip
    // on screen even on a narrow display
    const right = Math.min(
      Math.max(ACTIONS_MARGIN, wantedRight),
      Math.max(ACTIONS_MARGIN, window.innerWidth - stripWidth - ACTIONS_MARGIN),
    );
    setActionsPosition({
      top: rect.top,
      right,
      height: rect.height,
    });
  }, []);

  /**
   * Closes the action strip on a left click instead of toggling the timer.
   * @param {MouseEvent} e - The click event.
   */
  const onPillClick = React.useCallback(
    (e) => {
      if (actionsPosition) {
        setActionsPosition(null);
        return;
      }
      toggle(e);
    },
    [actionsPosition, toggle],
  );

  if (!visible) return null;

  const duration = getPhaseDuration(session.phase, durations);
  const remaining =
    session.running && session.endsAt
      ? Math.max(0, session.endsAt - now)
      : session.pausedMs || 0;
  const progress = session.started
    ? Math.min(1, Math.max(0, 1 - remaining / duration))
    : 0;
  const paused = session.started && !session.running;

  const classes = Utils.classNames("pomodoro", {
    "pomodoro--idle": !session.started,
    [PHASE_CLASSES[session.phase]]: session.started,
    "pomodoro--paused": paused,
    "pomodoro--ended": ended,
  });

  /**
   * Icon for the widget: the phase, or the action a click will perform.
   * @returns {React.Component|null} The icon component.
   */
  const getIcon = () => {
    if (!showIcon) return null;
    // Upstream's Playing/Paused glyphs are swapped: Playing draws the pause bars
    if (paused) return Icons.Playing;
    if (session.phase === REST) return Icons.Coffee;
    if (session.phase === LONG_REST) return Icons.Moon;
    return Icons.Pomodoro;
  };

  const dots =
    showSessionDots && durations.longRestEvery > 0
      ? Array.from({ length: durations.longRestEvery }, (_, index) => {
          const done =
            session.phase === LONG_REST
              ? durations.longRestEvery
              : session.completed % durations.longRestEvery;
          return (
            <span
              key={index}
              className={Utils.classNames("pomodoro__dot", {
                "pomodoro__dot--done": index < done,
              })}
            />
          );
        })
      : null;

  const nextPhase = getNextPhase(
    session.phase,
    session.completed,
    durations,
    false,
  ).phase;

  const actions = [
    {
      key: "toggle",
      Icon: session.running ? Icons.Playing : Icons.Paused,
      title: session.running
        ? "Pause"
        : session.started
          ? "Resume"
          : "Start focus",
      onSelect: toggle,
    },
    {
      key: "restart",
      Icon: Icons.Restart,
      title: `Restart ${PHASE_LABELS[session.phase].toLowerCase()} (${formatTime(duration)})`,
      onSelect: restartPhase,
    },
    {
      key: "skip",
      Icon: Icons.Skip,
      title: `Skip to ${PHASE_LABELS[nextPhase].toLowerCase()}`,
      onSelect: skipPhase,
    },
    {
      key: "reset",
      Icon: Icons.Remove,
      title: "Reset session",
      onSelect: resetSession,
    },
  ];

  return (
    <React.Fragment>
      <div className="pomodoro-wrapper" ref={wrapperRef} onAuxClick={onAuxClick}>
        <DataWidget.Widget
          classes={classes}
          Icon={getIcon()}
          onClick={onPillClick}
          onRightClick={openActions}
          onMiddleClick={skipPhase}
          disableSlider
        >
          {showPhaseLabel && session.started && (
            <span className="pomodoro__label">
              {PHASE_LABELS[session.phase]}
            </span>
          )}
          <span className="pomodoro__time">{formatTime(remaining)}</span>
          {dots && <span className="pomodoro__dots">{dots}</span>}
          <span
            className="pomodoro__fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </DataWidget.Widget>
      </div>
      {actionsPosition && (
        <div
          className="pomodoro-actions"
          ref={actionsRef}
          style={{
            top: actionsPosition.top,
            right: actionsPosition.right,
            height: actionsPosition.height,
          }}
          onMouseLeave={() => setActionsPosition(null)}
        >
          {actions.map((item) => (
            <button
              className="pomodoro-actions__item"
              key={item.key}
              type="button"
              title={item.title}
              aria-label={item.title}
              onClick={(e) => {
                item.onSelect(e);
                setActionsPosition(null);
              }}
            >
              <SuspenseIcon>
                <item.Icon />
              </SuspenseIcon>
            </button>
          ))}
        </div>
      )}
    </React.Fragment>
  );
});

Widget.displayName = "Pomodoro";
