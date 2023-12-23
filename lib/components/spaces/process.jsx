import Window from "./window.jsx";
import * as Utils from "../../utils";
import { useSimpleBarContext } from "../context.jsx";

export { processStyles as styles } from "../../styles/components/process";

export const Component = () => {
  const { displayIndex, spaces, windows, skhdMode, settings } =
    useSimpleBarContext();
  const { process, spacesDisplay, widgets } = settings;
  const { processWidget } = widgets;
  const { exclusionsAsRegex } = spacesDisplay;
  const { centered, showCurrentSpaceMode, displaySkhdMode, showOnDisplay } =
    process;

  const visible =
    processWidget &&
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) &&
    windows;

  if (!visible) return null;

  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");

  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  const currentSpace = spaces.find((space) => {
    const {
      "is-visible": isVisible,
      visible: __legacyIsVisible,
      display,
    } = space;
    return (isVisible ?? __legacyIsVisible) && display === displayIndex;
  });

  const { stickyWindows, nonStickyWindows } = Utils.stickyWindowWorkaround({
    windows,
    uniqueApps: false,
    currentDisplay: displayIndex,
    currentSpace: currentSpace?.index,
    exclusions,
    titleExclusions,
    exclusionsAsRegex,
  });

  const apps = [...stickyWindows, ...nonStickyWindows];

  const classes = Utils.classnames("process", {
    "process--centered": centered,
  });

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
};
