import * as Uebersicht from "uebersicht";
import { SuspenseIcon } from "../icons/icon.jsx";
import * as Icons from "../icons/icons.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

const { React } = Uebersicht;

/**
 * Missive component to display a notification.
 * @param {Object} props - The properties object.
 * @param {string} props.id - The unique identifier for the missive.
 * @param {string} props.side - The side where the missive should appear ('left' or 'right').
 * @param {string} props.content - The content of the missive.
 * @param {number} [props.timeout] - The timeout for the missive to auto-close.
 * @returns {JSX.Element} The Missive component.
 */
export default function Missive({ id, side, content, timeout }) {
  // Get the setMissives function from the context
  const { setMissives } = useSimpleBarContext();

  // Generate class names based on the side prop
  const classes = Utils.classNames("missive", {
    "missive--left": side === "left",
    "missive--right": side === "right",
  });

  // Close the missive by removing it from the context and clearing the timeout.
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
