import * as Uebersicht from "uebersicht";
import * as Icons from "./icons/icons.jsx";
import { SuspenseIcon } from "./icons/icon.jsx";
import { useSimpleBarContext } from "./simple-bar-context.jsx";

const { React } = Uebersicht;

export { sideIconStyles as styles } from "../../lib/styles/components/side-icon";

/**
 * Component to render the side icon based on the settings.
 *
 * @returns {JSX.Element|null} The side icon component or null if sideDecoration is disabled.
 */
export function Component() {
  // Using context to get settings
  const { settings } = useSimpleBarContext();
  // Destructuring sideDecoration from global settings
  const { sideDecoration } = settings.global;

  // If sideDecoration is disabled, return null
  if (!sideDecoration) return null;

  // Render the side icon component
  return (
    <div className="side-icon">
      <SuspenseIcon>
        <Icons.Apple className="side-icon__svg" />
      </SuspenseIcon>
    </div>
  );
}
