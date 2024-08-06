import * as Uebersicht from "uebersicht";
import * as Icons from "./icons/icons.jsx";
import { SuspenseIcon } from "./icons/icon.jsx";
import { useSimpleBarContext } from "./simple-bar-context.jsx";

const { React } = Uebersicht;

export { sideIconStyles as styles } from "../../lib/styles/components/side-icon";

export function Component() {
  const { settings } = useSimpleBarContext();
  const { sideDecoration } = settings.global;

  if (!sideDecoration) return null;

  return (
    <div className="side-icon">
      <SuspenseIcon>
        <Icons.Apple className="side-icon__svg" />
      </SuspenseIcon>
    </div>
  );
}
