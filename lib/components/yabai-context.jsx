import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
import useServerSocket from "../hooks/use-server-socket.js";
import * as Yabai from "../yabai.js";
import * as Skhd from "../skhd.js";

const { React } = Uebersicht;

const YabaiContext = React.createContext({
  spaces: [],
  windows: [],
  skhdMode: "",
});

export function useYabaiContext() {
  return React.useContext(YabaiContext);
}

export default React.memo(YabaiContextProvider);

function YabaiContextProvider({ spaces, windows, skhdMode, children }) {
  const { settings, setYabaiDisplays } = useSimpleBarContext();
  const { enableServer, yabaiServerRefresh } = settings.global;
  const { displaySkhdMode } = settings.process;
  const serverEnabled = enableServer && yabaiServerRefresh;

  const [yabaiSpaces, setYabaiSpaces] = React.useState(spaces);
  const [yabaiWindows, setYabaiWindows] = React.useState(windows);
  const [currentSkhdMode, setCurrentSkhdMode] = React.useState(skhdMode);

  const resetSpaces = () => {
    setYabaiSpaces([]);
  };

  const resetWindows = () => {
    setYabaiWindows([]);
  };

  const resetDisplays = () => {
    setYabaiDisplays([]);
  };

  const resetSkhdMode = () => {
    setCurrentSkhdMode({});
  };

  const getSpaces = async () => {
    const newSpaces = await Yabai.getSpaces();
    setYabaiSpaces(newSpaces);
  };

  const getWindows = async () => {
    const newWindows = await Yabai.getWindows();
    setYabaiWindows(newWindows);
  };

  const getDisplays = async () => {
    const newDisplays = await Yabai.getDisplays();
    setYabaiDisplays(newDisplays);
  };

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
