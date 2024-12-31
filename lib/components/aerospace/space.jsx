import * as Uebersicht from "uebersicht";
import OpenedApps from "./opened-apps.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";
import * as Aerospace from "../../aerospace.js";

const { React } = Uebersicht;

export default function Space({ space, display, lastOfSpace }) {
  const { windows } = space;
  const { settings } = useSimpleBarContext();
  const { spacesDisplay } = settings;
  const { exclusionsAsRegex, hideDuplicateAppsInSpaces } = spacesDisplay;
  const { workspace, focused } = space;

  if (display !== space["monitor-id"]) return null;

  const onClick = (e) => {
    if (focused) return;
    Aerospace.goToSpace(workspace);
    Utils.clickEffect(e);
  };

  const hidden = !windows.length && spacesDisplay.hideEmptySpaces;

  if (hidden) return null;

  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");
  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  const filteredWindows = windows.filter((window) =>
    Utils.filterApps(window, exclusions, titleExclusions, exclusionsAsRegex)
  );

  const displayedWindows = hideDuplicateAppsInSpaces
    ? filteredWindows.reduce((acc, window) => {
        const isDuplicate = acc.find((w) => w.app === window.app);
        return isDuplicate ? acc : [...acc, window];
      }, [])
    : filteredWindows;

  const classes = Utils.classNames("space", {
    "space--focused": focused,
    "space--empty": windows.length,
  });

  return (
    <React.Fragment>
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && (
        <div className="spaces__separator" />
      )}
      <div className={classes}>
        <button className="space__inner" onClick={onClick}>
          {workspace}
          <OpenedApps apps={displayedWindows} />
        </button>
      </div>
    </React.Fragment>
  );
}
