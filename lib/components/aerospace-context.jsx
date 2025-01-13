import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
import useServerSocket from "../hooks/use-server-socket.js";
import * as Aerospace from "../aerospace.js";

const { React } = Uebersicht;

const AerospaceContext = React.createContext({
  spaces: [],
  windows: [],
  mode: "",
});

export function useAerospaceContext() {
  return React.useContext(AerospaceContext);
}

export default React.memo(AerospaceContextProvider);

function AerospaceContextProvider({ children }) {
  const { settings, displayIndex, displays } = useSimpleBarContext();
  const { enableServer, aerospaceServerRefresh } = settings.global;
  const serverEnabled = enableServer && aerospaceServerRefresh;

  const [aerospaceSpaces, setAerospaceSpaces] = React.useState([]);

  const getSpaces = React.useCallback(async () => {
    let focusedWindow = {};
    const [focusedSpace] = await Aerospace.getFocusedSpace();
    try {
      [focusedWindow] = await Aerospace.getFocusedWindow();
      // eslint-disable-next-line no-empty
    } catch (e) {}
    const spaces = await Promise.all(
      displays.map(async (display) => {
        const result = await Aerospace.getSpaces(display);
        return Promise.all(
          result.map(async (space) => {
            const focused = space.workspace === focusedSpace.workspace;
            const windows = await Aerospace.getWindows(space.workspace);
            const formatted = windows.map((window) => {
              const focused =
                window["window-id"] === focusedWindow["window-id"];
              return {
                ...window,
                focused,
              };
            });
            return { ...space, windows: formatted, focused, monitor: display };
          })
        );
      })
    );
    setAerospaceSpaces(spaces.flat());
  }, [displays]);

  const resetSpaces = () => {
    setAerospaceSpaces([]);
  };

  useServerSocket("spaces", serverEnabled, getSpaces, resetSpaces);

  React.useEffect(() => {
    getSpaces();
  }, [getSpaces, displayIndex]);

  return (
    <AerospaceContext.Provider value={{ spaces: aerospaceSpaces }}>
      {children}
    </AerospaceContext.Provider>
  );
}
