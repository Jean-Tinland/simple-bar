import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { musicStyles as styles } from "../../styles/components/data/music";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

/**
 * Music widget component.
 * @returns {JSX.Element|null} The music widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, musicWidgetOptions } = settings;
  const { musicWidget } = widgets;
  const { refreshFrequency, showSpecter, showOnDisplay, showIcon } =
    musicWidgetOptions;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible on the current display
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && musicWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const [isMusicActive, setIsMusicActive] = React.useState(false);

  /**
   * Resets the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
    setIsMusicActive(false);
  };

  /**
   * Fetches the current music information.
   */
  const getMusic = React.useCallback(async () => {
    if (!visible) return;
    const osVersion = await Utils.cachedRun(`sw_vers -productVersion`, refresh);
    const processName =
      Utils.cleanupOutput(osVersion) === "10.15" ? "iTunes" : "Music";
    const isRunning = await Utils.cachedRun(
      `pgrep -xq "${processName}" && echo "true" || echo "false"`,
      refresh,
    );
    if (Utils.cleanupOutput(isRunning) === "false") {
      setLoading(false);
      setIsMusicActive(false);
      return;
    }
    const output = await Utils.cachedRun(
      `osascript -e 'tell application "${processName}"' -e 'set output to (player state as string) & "|" & (name of current track as string) & "|" & (artist of current track as string)' -e 'end tell' 2>/dev/null || echo "stopped|unknown track|unknown artist"`,
      refresh,
    );
    const [playerState, trackName, artistName] =
      Utils.cleanupOutput(output).split("|");
    setState({
      playerState,
      trackName,
      artistName,
      processName: Utils.cleanupOutput(processName),
    });
    setIsMusicActive(true);
    setLoading(false);
  }, [visible, refresh]);

  // Use server socket to listen for music events
  useServerSocket("music", visible, getMusic, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getMusic, refresh);

  if (loading) return <DataWidgetLoader.Widget className="music" />;
  if (!state || !isMusicActive) return null;
  const { processName, playerState, trackName, artistName } = state;

  if (!trackName.length) return null;

  const isPlaying = playerState === "playing";
  const Icon = isPlaying ? Icons.Playing : Icons.Paused;

  /**
   * Handles click event to toggle play/pause.
   * @param {React.MouseEvent} e - The click event.
   */
  const onClick = (e) => {
    Utils.clickEffect(e);
    togglePlay(!isPlaying, processName);
    getMusic();
  };

  /**
   * Handles right-click event to skip to the next track.
   * @param {React.MouseEvent} e - The right-click event.
   */
  const onRightClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(
      `osascript -e 'tell application "${processName}" to Next Track'`,
    );
    getMusic();
  };

  /**
   * Handles middle-click event to open the music application.
   * @param {React.MouseEvent} e - The middle-click event.
   */
  const onMiddleClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`open -a '${processName}'`);
    getMusic();
  };

  const classes = Utils.classNames("music", {
    "music--playing": isPlaying,
  });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Icon : null}
      onClick={onClick}
      onRightClick={onRightClick}
      onMiddleClick={onMiddleClick}
      showSpecter={showSpecter && isPlaying}
    >
      {trackName} - {artistName}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Music";

/**
 * Toggles play/pause state of the music application.
 * @param {boolean} isPaused - Whether the music is paused.
 * @param {string} processName - The name of the music application process.
 */
function togglePlay(isPaused, processName) {
  if (isPaused) {
    Uebersicht.run(`osascript -e 'tell application "${processName}" to play'`);
  } else {
    Uebersicht.run(`osascript -e 'tell application "${processName}" to pause'`);
  }
}
