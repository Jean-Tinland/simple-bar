import * as Uebersicht from "uebersicht";
import * as AppIcons from "../../app-icons.js";
import { SuspenseIcon } from "../icons/icon.jsx";
import * as Utils from "../../utils.js";

const { React } = Uebersicht;

/**
 * OpenedApps component to display a list of opened applications.
 * @param {Object} props - Component properties.
 * @param {Array} props.apps - The list of opened applications.
 * @returns {JSX.Element|null} The rendered component or null if no applications are present.
 */
export default function OpenedApps({ apps }) {
  // Return null if no applications are present
  if (!apps.length) return null;

  // Sort and map the applications to JSX elements
  return Utils.sortWindows(apps).map((app, i) => {
    const {
      "is-minimized": isMinimized,
      minimized: __legacyIsMinimized,
      "has-focus": hasFocus,
      focused: __legacyHasFocus,
      "has-parent-zoom": hasParentZoom,
      "zoom-parent": __legacyHasParentZoom,
      "has-fullscreen-zoom": hasFullscreenZoom,
      "zoom-fullscreen": __legacyHasFullscreenZoom,
      "is-topmost": isTopmost,
    } = app;
    const appName = app.app.replace(/[\u200E]/g, "");

    // Skip minimized applications
    if (isMinimized ?? __legacyIsMinimized) return null;

    // Get the application icon or default icon
    const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

    // Determine the CSS classes for the icon
    const classes = Utils.classNames("space__icon", {
      "space__icon--focused": hasFocus ?? __legacyHasFocus,
      "space__icon--fullscreen":
        (hasParentZoom ?? __legacyHasParentZoom) ||
        (hasFullscreenZoom ?? __legacyHasFullscreenZoom),
      "space__icon--topmost": isTopmost,
    });

    // Render the application icon
    return (
      <SuspenseIcon key={i}>
        <Icon className={classes} />
      </SuspenseIcon>
    );
  });
}
