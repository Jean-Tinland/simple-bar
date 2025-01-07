import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import Missive from "./missive.jsx";

export { missivesStyles as styles } from "../../styles/components/missives";

const { React } = Uebersicht;

export function Component() {
  const { missives } = useSimpleBarContext();

  return (
    <div className="missives">
      {missives.map(({ id, side, content, timeout }) => {
        return (
          <Missive
            key={id}
            id={id}
            side={side}
            content={content}
            timeout={timeout}
          />
        );
      })}
    </div>
  );
}
