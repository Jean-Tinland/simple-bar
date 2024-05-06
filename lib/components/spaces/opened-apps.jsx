import * as AppIcons from "../../app-icons";
import * as Utils from "../../utils";

export default function OpenedApps({ apps }) {
  if (!apps.length) return null;
  return Utils.sortWindows(apps).map((app, i) => {
    const {
      "is-minimized": isMinimized,
      minimized: __legacyIsMinimized,
      "has-focus": hasFocus,
      focused: __legacyHasFocus,
      app: appName,
      "has-parent-zoom": hasParentZoom,
      "zoom-parent": __legacyHasParentZoom,
      "has-fullscreen-zoom": hasFullscreenZoom,
      "zoom-fullscreen": __legacyHasFullscreenZoom,
      "is-topmost": isTopmost,
    } = app;
    if (isMinimized ?? __legacyIsMinimized) return null;

    const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

    const classes = Utils.classNames("space__icon", {
      "space__icon--focused": hasFocus ?? __legacyHasFocus,
      "space__icon--fullscreen":
        (hasParentZoom ?? __legacyHasParentZoom) ||
        (hasFullscreenZoom ?? __legacyHasFullscreenZoom),
      "space__icon--topmost": isTopmost,
    });

    return <Icon className={classes} key={i} />;
  });
}
