import * as Uebersicht from "uebersicht";
import * as Settings from "../settings";

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
  const [missives, setMissives] = React.useState([]);

  React.useEffect(() => {
    const loadExternalConfig = async () => {
      const configFileExists = await Settings.checkIfConfigFileExists();
      if (!configFileExists) return;
      try {
        const config = JSON.parse(await Uebersicht.run(`cat ~/.simplebarrc`));
        setSettings(config);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading external config:", e);
      }
    };
    loadExternalConfig();
  }, []);

  const { windowManager, enableServer, yabaiServerRefresh } = settings.global;
  const serverEnabled = enableServer && yabaiServerRefresh;
  const isYabai = windowManager === "yabai";

  const currentDisplays = serverEnabled && isYabai ? _displays : displays;

  const displayId = parseInt(window.location.pathname.replace("/", ""), 10);

  const formattedDisplays = currentDisplays.map((display) => {
    return display.index ?? display["monitor-appkit-nsscreen-screens-id"];
  });

  const currentDisplay = formattedDisplays?.find((id) => id === displayId) || 1;

  const pushMissive = (newMissive) => {
    const now = Date.now();
    const { content, side = "right", delay = 5000 } = newMissive;
    const timeout =
      typeof delay === "number" && delay !== 0
        ? setTimeout(() => {
            setMissives((current) => {
              return current.filter((m) => m.id !== now);
            });
          }, delay)
        : undefined;
    setMissives((current) => {
      return [...current, { id: now, content, side, timeout }];
    });
  };

  return (
    <SimpleBarContext.Provider
      value={{
        displayIndex: currentDisplay,
        SIPDisabled,
        settings,
        setSettings,
        displays: formattedDisplays,
        setDisplays,
        missives,
        setMissives,
        pushMissive,
      }}
    >
      {children}
    </SimpleBarContext.Provider>
  );
}
