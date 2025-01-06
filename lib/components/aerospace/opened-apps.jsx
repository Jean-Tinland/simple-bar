import * as Uebersicht from "uebersicht";
import * as AppIcons from "../../app-icons.js";
import { SuspenseIcon } from "../icons/icon.jsx";
import * as Utils from "../../utils.js";

const { React } = Uebersicht;

export default function OpenedApps({ apps }) {
  if (!apps.length) return null;

  return apps.map((app, i) => {
    const { focused, "app-name": appName } = app;
    const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

    const classes = Utils.classNames("space__icon", {
      "space__icon--focused": focused,
    });

    return (
      <SuspenseIcon key={i}>
        <Icon className={classes} />
      </SuspenseIcon>
    );
  });
}
