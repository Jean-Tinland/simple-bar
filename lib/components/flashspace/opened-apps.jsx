import * as Uebersicht from "uebersicht";
import * as AppIcons from "../../app-icons.js";
import { SuspenseIcon } from "../icons/icon.jsx";

const { React } = Uebersicht;

/**
 * OpenedApps component to display icons of opened applications.
 * @param {Object} props - The component props.
 * @param {Array} props.apps - The list of opened applications.
 * @returns {JSX.Element|null} The rendered component or null if no apps are opened.
 */
export default function OpenedApps({ apps }) {
  if (!apps.length) return null;

  return apps.map((app, i) => {
    const { name: appName } = app;
    const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

    return (
      <SuspenseIcon key={i}>
        <Icon className="space__icon" />
      </SuspenseIcon>
    );
  });
}
