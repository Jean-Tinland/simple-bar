import * as Uebersicht from "uebersicht";
import OpenedApps from "./opened-apps.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";
import * as Aerospace from "../../aerospace.js";

const { React } = Uebersicht;

/**
 * Space component to display a single space.
 * @param {Object} props - The component props.
 * @param {Object} props.space - The space object.
 * @param {boolean} props.lastOfSpace - Indicates if this is the last space of the monitor.
 * @returns {JSX.Element|null} The rendered component.
 */
export default function Space({ space, lastOfSpace }) {
  const { windows } = space;
  const { settings } = useSimpleBarContext();
  const { spacesDisplay } = settings;
  const {
    displayAllSpacesOnAllScreens,
    exclusionsAsRegex,
    hideDuplicateAppsInSpaces,
  } = spacesDisplay;
  const { workspace, focused } = space;

  /**
   * Handle click event to switch to the clicked space.
   * @param {Event} e - The click event.
   */
  const onClick = (e) => {
    if (focused) return;
    Aerospace.goToSpace(workspace);
    Utils.clickEffect(e);
  };

  // Determine if the space should be hidden
  const hidden = !focused && !windows.length && spacesDisplay.hideEmptySpaces;

  if (hidden) return null;

  // Get exclusions and title exclusions based on settings
  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");
  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  // Filter windows based on exclusions
  const filteredWindows = windows.filter((window) =>
    Utils.filterApps(window, exclusions, titleExclusions, exclusionsAsRegex),
  );

  // Remove duplicate apps if the setting is enabled
  const displayedWindows = hideDuplicateAppsInSpaces
    ? filteredWindows.reduce((acc, window) => {
        const isDuplicate = acc.find(
          (w) => w["app-name"] === window["app-name"],
        );
        return isDuplicate ? acc : [...acc, window];
      }, [])
    : filteredWindows;

  // Determine the CSS classes for the space
  const classes = Utils.classNames("space", {
    "space--focused": focused,
    "space--empty": windows.length,
  });

  return (
    <React.Fragment>
      {displayAllSpacesOnAllScreens && lastOfSpace && (
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
