import * as Uebersicht from "uebersicht";

const { React } = Uebersicht;

const SimpleBarContext = React.createContext({
  display: 1,
  SIPDisabled: false,
  settings: {},
  setSettings: () => {},
});

export const useSimpleBarContext = () => React.useContext(SimpleBarContext);

export default React.memo(ContextProvider);

function ContextProvider({
  initialSettings,
  spaces,
  windows,
  displays,
  SIPDisabled,
  skhdMode,
  children,
}) {
  const [settings, setSettings] = React.useState(initialSettings);

  const displayId = parseInt(window.location.pathname.replace("/", ""), 10);
  const { index: displayIndex } =
    displays?.find((d) => d.id === displayId) || {};

  return (
    <SimpleBarContext.Provider
      value={{
        displayIndex,
        SIPDisabled,
        settings,
        setSettings,
        spaces,
        windows,
        displays,
        skhdMode,
      }}
    >
      {children}
    </SimpleBarContext.Provider>
  );
}
