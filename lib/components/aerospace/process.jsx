import * as Uebersicht from "uebersicht";
import Window from "./window.jsx";
import * as Utils from "../../utils";
import { useAerospaceContext } from "../aerospace-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { processStyles as styles } from "../../styles/components/process";

const { React } = Uebersicht;

export const Component = React.memo(() => {
  const { spaces } = useAerospaceContext();
  const { settings, displayIndex } = useSimpleBarContext();
  const { spacesDisplay, process, widgets } = settings;
  const { exclusionsAsRegex } = spacesDisplay;
  const { processWidget } = widgets;
  const { centered, showOnDisplay } = process;

  const visible =
    spaces?.length &&
    processWidget &&
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay);

  if (!visible) return null;

  const { windows = [] } =
    spaces.find((space) => space.focused && space.monitor === displayIndex) ||
    {};

  if (!windows.length) return null;

  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");

  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  const classes = Utils.classNames("process", {
    "process--centered": centered,
  });

  const filteredWindows = windows.filter((window) =>
    Utils.filterApps(window, exclusions, titleExclusions, exclusionsAsRegex)
  );

  return (
    <div className={classes}>
      <div className="process__container">
        {filteredWindows.map((window, i) => (
          <Window key={i} window={window} />
        ))}
      </div>
    </div>
  );
});

Component.displayName = "Process";
