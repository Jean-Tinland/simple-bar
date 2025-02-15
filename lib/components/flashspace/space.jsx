import * as Uebersicht from "uebersicht";
import OpenedApps from "./opened-apps.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

const { React } = Uebersicht;

/**
 * Space component to display a single space.
 * @param {Object} props - The component props.
 * @param {number} props.index - The space index.
 * @param {Object} props.workspace - The workspace object.
 * @param {string} props.currentWorkspace - The current workspace name.
 * @returns {JSX.Element|null} The rendered component.
 */
export default function Space({ index, workspace, currentWorkspace }) {
  // Get various settings from simple-bar context
  const { settings } = useSimpleBarContext();
  const { showOnlyFlashspaceSpaceIndex, hideFlashspaceAppIcons } =
    settings.spacesDisplay;
  const { name, apps } = workspace;

  // Determine the CSS classes for the space
  const classes = Utils.classNames("space", {
    "space--focused": name === currentWorkspace,
    "space--empty": apps.length,
  });

  const label = showOnlyFlashspaceSpaceIndex ? index : name;

  return (
    <div className={classes}>
      <button className="space__inner" disabled>
        {label}
        {!hideFlashspaceAppIcons && <OpenedApps apps={apps} />}
      </button>
    </div>
  );
}
