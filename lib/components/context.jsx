import * as Uebersicht from "uebersicht";

const SimpleBarContext = Uebersicht.React.createContext({
  display: 1,
  SIPDisabled: false,
  settings: {},
  setSettings: () => {},
});

export const useSimpleBarContext = () =>
  Uebersicht.React.useContext(SimpleBarContext);

export default Uebersicht.React.memo(ContextProvider);

function ContextProvider({ initialSettings, display, SIPDisabled, children }) {
  const [settings, setSettings] = Uebersicht.React.useState(initialSettings);

  return (
    <SimpleBarContext.Provider
      value={{ display, SIPDisabled, settings, setSettings }}
    >
      {children}
    </SimpleBarContext.Provider>
  );
}
