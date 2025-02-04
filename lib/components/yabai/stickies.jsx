import OpenedApps from "./opened-apps.jsx";
import { useYabaiContext } from "../yabai-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

/**
 * Stickies component to display sticky windows.
 * @param {Object} props - Component properties.
 * @param {Object} props.display - The current display information.
 * @returns {JSX.Element|null} The rendered component or null if no sticky windows are present.
 */
export default function Stickies({ display }) {
  // Get windows from yabai context
  const { windows } = useYabaiContext();
  // Get settings from simple-bar context
  const { settings } = useSimpleBarContext();
  const { spacesDisplay } = settings;
  const { exclusionsAsRegex, hideDuplicateAppsInSpaces } = spacesDisplay;

  // Determine exclusions based on settings
  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");
  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  // Get sticky windows using a utility function
  const { stickyWindows: apps } = Utils.stickyWindowWorkaround({
    windows,
    uniqueApps: hideDuplicateAppsInSpaces,
    currentDisplay: display,
    currentSpace: undefined,
    exclusions,
    titleExclusions,
    exclusionsAsRegex,
  });

  // Filter out minimized sticky windows
  const notMinimizedStikies = apps.filter((app) => {
    const { "is-minimized": isMinimized, minimized: __legacyIsMinimized } = app;
    return !(isMinimized || __legacyIsMinimized);
  });

  // Return null if no non-minimized sticky windows are present
  if (!notMinimizedStikies?.length) return null;

  // Render the sticky windows
  return (
    <div className="stickies">
      <div className="stickies__inner">
        <OpenedApps apps={apps} />
      </div>
    </div>
  );
}
