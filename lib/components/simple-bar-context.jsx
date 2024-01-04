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
  const [yabaiDisplays, setYabaiDisplays] = React.useState(displays);

  const { enableServer, yabaiServerRefresh } = settings.global;
  const serverEnabled = enableServer && yabaiServerRefresh;

  const currentDisplays = serverEnabled ? yabaiDisplays : displays;

  const displayId = parseInt(window.location.pathname.replace("/", ""), 10);
  const { index: displayIndex } =
    currentDisplays?.find((d) => d.id === displayId) || {};

  return (
    <SimpleBarContext.Provider
      value={{
        displayIndex,
        SIPDisabled,
        settings,
        setSettings,
        setYabaiDisplays,
      }}
    >
      {children}
    </SimpleBarContext.Provider>
  );
}
