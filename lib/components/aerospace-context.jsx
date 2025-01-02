import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
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
  const { displayIndex, displays } = useSimpleBarContext();

  const [aerospaceSpaces, setAerospaceSpaces] = React.useState([]);

  React.useEffect(() => {
    const updateState = async () => {
      let focusedWindow = {};
      const [focusedSpace] = await Aerospace.getFocusedSpace();
      try {
        [focusedWindow] = await Aerospace.getFocusedWindow();
        // eslint-disable-next-line no-empty
      } catch (e) {}
      const spaces = await Promise.all(
        displays.map(async (display) => {
          const result = await Aerospace.getSpaces(display["monitor-id"]);
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
              return { ...space, windows: formatted, focused };
            })
          );
        })
      );
      setAerospaceSpaces(spaces.flat());
    };
    updateState();
  }, [displayIndex, displays]);

  return (
    <AerospaceContext.Provider value={{ spaces: aerospaceSpaces }}>
      {children}
    </AerospaceContext.Provider>
  );
}
