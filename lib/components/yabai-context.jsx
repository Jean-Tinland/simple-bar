import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
import useServerSocket from "../hooks/use-server-socket.js";
import * as Yabai from "../yabai.js";

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

let renderCount = 0;

function YabaiContextProvider({ spaces, windows, skhdMode, children }) {
  const { settings, setYabaiDisplays } = useSimpleBarContext();
  const { enableServer, yabaiServerRefresh } = settings.global;
  const serverEnabled = enableServer && yabaiServerRefresh;

  const [yabaiSpaces, setYabaiSpaces] = React.useState(spaces);
  const [yabaiWindows, setYabaiWindows] = React.useState(windows);

  const resetSpaces = () => {
    setYabaiSpaces([]);
  };

  const resetWindows = () => {
    setYabaiWindows([]);
  };

  const resetDisplays = () => {
    setYabaiDisplays([]);
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

  useServerSocket("spaces", serverEnabled, getSpaces, resetSpaces);
  useServerSocket("windows", serverEnabled, getWindows, resetWindows);
  useServerSocket("displays", serverEnabled, getDisplays, resetDisplays);

  renderCount = renderCount + 1;

  return (
    <YabaiContext.Provider
      value={{
        spaces: serverEnabled ? yabaiSpaces : spaces,
        windows: serverEnabled ? yabaiWindows : windows,
        skhdMode,
      }}
    >
      {children}
    </YabaiContext.Provider>
  );
}
