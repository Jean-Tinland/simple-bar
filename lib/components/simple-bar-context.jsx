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
  const [missives, setMissives] = React.useState([]);

  const { windowManager, enableServer, yabaiServerRefresh } = settings.global;
  const serverEnabled = enableServer && yabaiServerRefresh;
  const isYabai = windowManager === "yabai";

  const currentDisplays = serverEnabled && isYabai ? _displays : displays;

  const displayId = parseInt(window.location.pathname.replace("/", ""), 10);

  const formattedDisplays = currentDisplays.map((display) => {
    return display.index ?? display["monitor-appkit-nsscreen-screens-id"];
  });

  const currentDisplay =
    formattedDisplays?.find((id) => id === displayId) || undefined;

  const displayIndex = currentDisplay || 1;

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
        displayIndex,
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
