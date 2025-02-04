import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import Missive from "./missive.jsx";
import useServerSocket from "../../hooks/use-server-socket.js";

export { missivesStyles as styles } from "../../styles/components/missives";

const { React } = Uebersicht;

/**
 * Component to display a list of missives.
 * It uses the simple-bar context to get settings and missives data.
 * It also sets up a server socket to receive new missives.
 *
 * @returns {JSX.Element} The rendered component.
 */
export function Component() {
  // Destructure settings, missives, and pushMissive function from the context
  const { settings, missives, pushMissive } = useSimpleBarContext();
  const { enableServer } = settings.global;

  // Set up a server socket to listen for "missive" events and push new missives
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
