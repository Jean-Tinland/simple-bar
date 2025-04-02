import * as Uebersicht from "uebersicht";
import OpenedApps from "./opened-apps.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";
import * as Flashspace from "../../flashspace.js";

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
  const focused = name === currentWorkspace;

  /**
   * Handle click event to switch to the clicked space.
   * @param {Event} e - The click event.
   */
  const onClick = (e) => {
    if (focused) return;
    Flashspace.goToSpace(name);
    Utils.clickEffect(e);
  };

  const label = showOnlyFlashspaceSpaceIndex ? index : name;

  // Determine the CSS classes for the space
  const classes = Utils.classNames("space", {
    "space--focused": focused,
    "space--empty": apps.length,
  });

  return (
    <div className={classes}>
      <button className="space__inner" onClick={onClick}>
        {label}
        {!hideFlashspaceAppIcons && <OpenedApps apps={apps} />}
      </button>
    </div>
  );
}
