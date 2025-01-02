import * as Uebersicht from "uebersicht";

const { React } = Uebersicht;

const SimpleBarContext = React.createContext({
  display: 1,
  SIPDisabled: false,
  settings: {},
  setSettings: () => {},
});

export const useSimpleBarContext = () => React.useContext(SimpleBarContext);

export default function SimpleBarContextProvider({
  initialSettings,
  displays,
  SIPDisabled,
  children,
}) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [_displays, setDisplays] = React.useState(displays);

  const { windowManager, enableServer, yabaiServerRefresh } = settings.global;
  const serverEnabled = enableServer && yabaiServerRefresh;

  const currentDisplays =
    serverEnabled && windowManager === "yabai" ? _displays : displays;

  const displayId = parseInt(window.location.pathname.replace("/", ""), 10);
  const currentDisplay =
    currentDisplays?.find((d) => {
      const id = d["monitor-appkit-nsscreen-screens-id"] ?? d.id;
      return id === displayId;
    }) || {};

  const displayIndex =
    currentDisplay.index ??
    currentDisplay["monitor-appkit-nsscreen-screens-id"];

  return (
    <SimpleBarContext.Provider
      value={{
        displayIndex,
        SIPDisabled,
        settings,
        setSettings,
        displays: currentDisplays,
        setDisplays,
      }}
    >
      {children}
    </SimpleBarContext.Provider>
  );
}
