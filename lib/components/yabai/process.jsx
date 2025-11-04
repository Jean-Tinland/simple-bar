import * as Uebersicht from "uebersicht";
import Window from "./window.jsx";
import * as Utils from "../../utils";
import { useYabaiContext } from "../yabai-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { processStyles as styles } from "../../styles/components/process";

const { React } = Uebersicht;

/**
 * Process component that displays the current windows and spaces information.
 * @returns {JSX.Element|null} The rendered component or null if not visible.
 */
const Component = React.memo(() => {
  // Get context values from yabai and simple-bar
  const { spaces, windows, skhdMode } = useYabaiContext();
  const { displayIndex, settings } = useSimpleBarContext();
  const { process, spacesDisplay, widgets } = settings;
  const { processWidget } = widgets;
  const { exclusionsAsRegex } = spacesDisplay;
  const { displayForFocusedSpace, centered, showCurrentSpaceMode, displaySkhdMode, showOnDisplay } =
    process;

  // Determine if the process widget should be visible
  const visible =
    processWidget &&
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) &&
    windows;

  if (!visible) return null;

  // Parse exclusions based on settings
  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");

  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  // Find the current space based on visibility and display index
  const currentSpace = spaces.find((space) => {
    const {
      "is-visible": isVisible,
      "has-focus" : hasFocus,
      visible: __legacyIsVisible,
      display,
    } = space;
    return (isVisible ?? __legacyIsVisible) && (displayForFocusedSpace ? hasFocus : display === displayIndex);
  });

  // Get sticky and non-sticky windows using a utility function
  const { stickyWindows, nonStickyWindows } = Utils.stickyWindowWorkaround({
    windows,
    uniqueApps: false,
    currentDisplay: displayIndex,
    currentSpace: currentSpace?.index,
    exclusions,
    titleExclusions,
    exclusionsAsRegex,
  });

  // Combine sticky and non-sticky windows
  const apps = [...stickyWindows, ...nonStickyWindows];

  // Determine CSS classes for the component
  const classes = Utils.classNames("process", {
    "process--centered": centered,
  });

  // Determine the current skhd mode and its color
  const currentSkhdMode = skhdMode.mode === "default" ? null : skhdMode.mode;
  const skhdModeColor = "var(--" + skhdMode.color + ")";

  return (
    <div className={classes}>
      <div className="process__container">
        {showCurrentSpaceMode && currentSpace && (
          <div key={currentSpace.index} className="process__layout">
            {currentSpace.type}
          </div>
        )}
        {displaySkhdMode && currentSkhdMode && (
          <div
            className="process__skhd-mode"
            style={{ backgroundColor: skhdModeColor }}
          >
            {currentSkhdMode}
          </div>
        )}
        {Utils.sortWindows(apps).map((window, i) => (
          <Window key={i} window={window} />
        ))}
      </div>
    </div>
  );
});

Component.displayName = "Process";

export default Component;
