import * as Uebersicht from "uebersicht";
import { SuspenseIcon } from "../icons/icon.jsx";
import * as Icons from "../icons/icons.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

const { React } = Uebersicht;

export default function Missive({ id, side, content, timeout }) {
  const { setMissives } = useSimpleBarContext();

  const classes = Utils.classNames("missive", {
    "missive--left": side === "left",
    "missive--right": side === "right",
  });

  const closeMissive = () => {
    setMissives((current) => {
      return current.filter((m) => m.id !== id);
    });
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return (
    <div key={id} className={classes}>
      <div className="missive__text">{content}</div>
      <button className="missive__close" onClick={closeMissive}>
        <SuspenseIcon>
          <Icons.Close className="missive__close-icon" />
        </SuspenseIcon>
      </button>
    </div>
  );
}
