import * as Uebersicht from "uebersicht";
import Window from "./window.jsx";
import * as Utils from "../../utils";
import { useAerospaceContext } from "../aerospace-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { processStyles as styles } from "../../styles/components/process";

const { React } = Uebersicht;

/**
 * Process component to display windows in the current space.
 * @returns {JSX.Element|null} The rendered component or null if not visible.
 */
const Component = React.memo(() => {
  // Get spaces from aerospace context
  const { spaces } = useAerospaceContext();
  // Get settings and display index from simple bar context
  const { settings, displayIndex } = useSimpleBarContext();
  const { spacesDisplay, process, widgets } = settings;
  const { exclusionsAsRegex } = spacesDisplay;
  const { processWidget } = widgets;
  const { centered, showOnDisplay } = process;

  // Determine if the component should be visible
  const visible =
    spaces?.length &&
    processWidget &&
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay);

  if (!visible) return null;

  // Find the focused space on the current display
  const { windows = [] } =
    spaces.find((space) => space.focused && space.monitor === displayIndex) ||
    {};

  if (!windows.length) return null;

  // Get exclusions for filtering windows
  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");

  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  // Generate class names for the component
  const classes = Utils.classNames("process", {
    "process--centered": centered,
  });

  // Filter windows based on exclusions
  const filteredWindows = windows.filter((window) =>
    Utils.filterApps(window, exclusions, titleExclusions, exclusionsAsRegex),
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

export default Component;
