import OpenedApps from "./opened-apps.jsx";
import { useYabaiContext } from "../yabai-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export default function Stickies({ display }) {
  const { windows } = useYabaiContext();
  const { settings } = useSimpleBarContext();
  const { spacesDisplay } = settings;
  const { exclusionsAsRegex, hideDuplicateAppsInSpaces } = spacesDisplay;
  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");
  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  const { stickyWindows: apps } = Utils.stickyWindowWorkaround({
    windows,
    uniqueApps: hideDuplicateAppsInSpaces,
    currentDisplay: display,
    currentSpace: undefined,
    exclusions,
    titleExclusions,
    exclusionsAsRegex,
  });

  const notMinimizedStikies = apps.filter((app) => {
    const { "is-minimized": isMinimized, minimized: __legacyIsMinimized } = app;
    return !(isMinimized || __legacyIsMinimized);
  });

  if (!notMinimizedStikies?.length) return null;

  return (
    <div className="stickies">
      <div className="stickies__inner">
        <OpenedApps apps={apps} />
      </div>
    </div>
  );
}
