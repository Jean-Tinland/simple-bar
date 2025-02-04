import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
import useServerSocket from "../hooks/use-server-socket.js";
import * as Yabai from "../yabai.js";
import * as Skhd from "../skhd.js";

const { React } = Uebersicht;

// Create a context with default values
const YabaiContext = React.createContext({
  spaces: [],
  windows: [],
  skhdMode: "",
});

/**
 * Custom hook to use the YabaiContext
 * @returns {Object} The context value
 */
export function useYabaiContext() {
  return React.useContext(YabaiContext);
}

export default React.memo(YabaiContextProvider);

/**
 * YabaiContextProvider component provides context for Yabai spaces, windows, and skhd mode.
 * It uses server sockets to fetch and update the context values.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.spaces - Initial spaces data.
 * @param {Array} props.windows - Initial windows data.
 * @param {Object} props.skhdMode - Initial skhd mode data.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The YabaiContext provider component.
 */
function YabaiContextProvider({ spaces, windows, skhdMode, children }) {
  const { settings, setDisplays } = useSimpleBarContext();
  const { enableServer, yabaiServerRefresh } = settings.global;
  const { displaySkhdMode } = settings.process;
  const serverEnabled = enableServer && yabaiServerRefresh;

  const [yabaiSpaces, setYabaiSpaces] = React.useState(spaces);
  const [yabaiWindows, setYabaiWindows] = React.useState(windows);
  const [currentSkhdMode, setCurrentSkhdMode] = React.useState(skhdMode);

  // Resets the spaces state to an empty array.
  const resetSpaces = () => {
    setYabaiSpaces([]);
  };

  // Resets the windows state to an empty array.
  const resetWindows = () => {
    setYabaiWindows([]);
  };

  // Resets the displays state to an empty array.
  const resetDisplays = () => {
    setDisplays([]);
  };

  // Resets the skhd mode state to an empty object.
  const resetSkhdMode = () => {
    setCurrentSkhdMode({});
  };

  // Fetches the current spaces from Yabai and updates the state.
  const getSpaces = async () => {
    const newSpaces = await Yabai.getSpaces();
    setYabaiSpaces(newSpaces);
  };

  // Fetches the current windows from Yabai and updates the state.
  const getWindows = async () => {
    const newWindows = await Yabai.getWindows();
    setYabaiWindows(newWindows);
  };

  // Fetches the current displays from Yabai and updates the state.
  const getDisplays = async () => {
    const newDisplays = await Yabai.getDisplays();
    setDisplays(newDisplays);
  };

  // Fetches the current skhd mode from Skhd and updates the state.
  const getSkhdMode = async () => {
    const newSkhdMode = await Skhd.getMode();
    setCurrentSkhdMode(newSkhdMode);
  };

  useServerSocket("spaces", serverEnabled, getSpaces, resetSpaces);
  useServerSocket("windows", serverEnabled, getWindows, resetWindows);
  useServerSocket("displays", serverEnabled, getDisplays, resetDisplays);
  useServerSocket("mode", displaySkhdMode, getSkhdMode, resetSkhdMode);

  return (
    <YabaiContext.Provider
      value={{
        spaces: serverEnabled ? yabaiSpaces : spaces,
        windows: serverEnabled ? yabaiWindows : windows,
        skhdMode: serverEnabled ? currentSkhdMode : skhdMode,
      }}
    >
      {children}
    </YabaiContext.Provider>
  );
}
