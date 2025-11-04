import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
import useServerSocket from "../hooks/use-server-socket.js";
import * as Aerospace from "../aerospace.js";

const { React } = Uebersicht;

// Create a context with default values
const AerospaceContext = React.createContext({
  spaces: [],
  windows: [],
  mode: "",
});

/**
 * Custom hook to use the AerospaceContext
 * @returns {Object} The context value
 */
export function useAerospaceContext() {
  return React.useContext(AerospaceContext);
}

// Memoized AerospaceContextProvider component
export default React.memo(AerospaceContextProvider);

/**
 * AerospaceContextProvider component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components
 * @returns {JSX.Element} The provider component
 */
function AerospaceContextProvider({ children }) {
  // Get settings, displayIndex, and displays from SimpleBarContext
  const { settings, displayIndex, displays } = useSimpleBarContext();
  const { enableServer, aerospaceServerRefresh } = settings.global;
  const serverEnabled = enableServer && aerospaceServerRefresh;

  // State to store aerospace spaces
  const [aerospaceSpaces, setAerospaceSpaces] = React.useState([]);

  // Fetches and sets the aerospace spaces
  const getSpaces = React.useCallback(async () => {
    let focusedWindow = {};
    const [focusedSpace] = await Aerospace.getFocusedSpace();
    try {
      [focusedWindow] = await Aerospace.getFocusedWindow();
      // eslint-disable-next-line no-empty
    } catch {}
    const spaces = await Promise.all(
      displays.map(async (display) => {
        const id = display["monitor-id"];
        const result = await Aerospace.getSpaces(id);
        return Promise.all(
          result.map(async (space) => {
            const focused = space.workspace === focusedSpace.workspace;
            const monitor = Aerospace.getCustomDisplayIndex(space);
            const windows = await Aerospace.getWindows(space.workspace);
            const formatted = windows.map((window) => {
              const focused =
                window["window-id"] === focusedWindow["window-id"];
              return {
                ...window,
                focused,
              };
            });
            return { ...space, windows: formatted, focused, monitor };
          })
        );
      })
    );
    setAerospaceSpaces(spaces.flat());
  }, [displays]);

  // Refreshes spaces with the data sent by simple-bar-server if it exists
  // in order to speed up the process then refreshes everything in background
  // else, simply refreshes everything
  const refreshSpaces = React.useCallback(
    async (data) => {
      if (data) {
        const { space } = data;
        setAerospaceSpaces((current) => {
          return current.map((s) => ({ ...s, focused: s.workspace === space }));
        });
        getSpaces();
      } else {
        await getSpaces();
      }
    },
    [getSpaces]
  );

  // Resets the aerospace spaces state
  const resetSpaces = () => {
    setAerospaceSpaces([]);
  };

  // Use server socket to fetch and reset spaces
  useServerSocket("spaces", serverEnabled, refreshSpaces, resetSpaces);

  // Fetch spaces on component mount and when displayIndex changes
  React.useEffect(() => {
    refreshSpaces();
  }, [refreshSpaces, displayIndex]);

  return (
    <AerospaceContext.Provider value={{ spaces: aerospaceSpaces }}>
      {children}
    </AerospaceContext.Provider>
  );
}
