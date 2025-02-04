import * as Uebersicht from "uebersicht";
import * as AppIcons from "../../app-icons";
import { SuspenseIcon } from "../icons/icon.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";
import * as Yabai from "../../yabai";

const { React } = Uebersicht;

/**
 * Window component to display a window in simple-bar.
 * @param {Object} props - The component props.
 * @param {Object} props.window - The window object containing window details.
 * @returns {JSX.Element|null} The rendered window component or null if the window is minimized or not focused.
 */
export default function Window({ window }) {
  const { settings } = useSimpleBarContext();
  const ref = React.useRef();

  // Destructure settings for process display options
  const {
    displayOnlyCurrent,
    hideWindowTitle,
    displayOnlyIcon,
    expandAllProcesses,
    displayStackIndex,
    displayOnlyCurrentStack,
  } = settings.process;

  // Destructure window properties
  const {
    "stack-index": stackIndex,
    "is-minimized": isMinimized,
    minimized: __legacyIsMinimized,
    "has-focus": hasFocus,
    focused: __legacyHasFocus,
    app: appName,
    title,
    id,
  } = window;

  // Determine if the window is focused
  const isFocused = hasFocus ?? __legacyHasFocus;

  // Return null if the window is minimized or not focused when displayOnlyCurrent is true
  if (
    (isMinimized ?? __legacyIsMinimized) ||
    (displayOnlyCurrent && !isFocused)
  ) {
    return null;
  }

  // Get the icon for the application or use the default icon
  const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

  /**
   * Handle click event on the window button.
   * @param {Event} e - The click event.
   */
  const onClick = (e) => {
    !displayOnlyCurrent && Utils.clickEffect(e);
    Yabai.focusWindow(id);
  };

  /**
   * Handle mouse enter event to start sliding animation.
   */
  const onMouseEnter = () => {
    Utils.startSliding(ref.current, ".process__inner", ".process__name");
  };

  /**
   * Handle mouse leave event to stop sliding animation.
   */
  const onMouseLeave = () => {
    Utils.stopSliding(ref.current, ".process__name");
  };

  // Generate class names for the window button
  const classes = Utils.classNames("process__window", {
    "process__window--expanded": expandAllProcesses,
    "process__window--focused": !displayOnlyCurrent && isFocused,
    "process__window--only-current": displayOnlyCurrent,
    "process__window--only-icon": displayOnlyIcon,
  });

  // Clean up the window name for display
  const cleanedUpName =
    appName !== title && title.length ? `${appName} / ${title}` : appName;
  const processName = hideWindowTitle ? appName : cleanedUpName;

  // Determine if the stack index should be displayed
  const showStackIndex =
    displayStackIndex &&
    (!displayOnlyCurrentStack || isFocused) &&
    stackIndex > 0;

  return (
    <button
      ref={ref}
      className={classes}
      onClick={onClick}
      onMouseEnter={displayOnlyIcon ? undefined : onMouseEnter}
      onMouseLeave={displayOnlyIcon ? undefined : onMouseLeave}
    >
      <SuspenseIcon>
        <Icon className="process__icon" />
      </SuspenseIcon>
      {!displayOnlyIcon && (
        <span className="process__inner">
          <span className="process__name">{processName}</span>
        </span>
      )}
      {showStackIndex && (
        <span className="process__stack-index">{stackIndex}</span>
      )}
    </button>
  );
}
