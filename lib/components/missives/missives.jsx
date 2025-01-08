import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import Missive from "./missive.jsx";
import useServerSocket from "../../hooks/use-server-socket.js";

export { missivesStyles as styles } from "../../styles/components/missives";

const { React } = Uebersicht;

export function Component() {
  const { settings, missives, pushMissive } = useSimpleBarContext();
  const { enableServer } = settings.global;

  useServerSocket("missive", enableServer, pushMissive);

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
