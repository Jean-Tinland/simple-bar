import * as Uebersicht from "uebersicht";

const SimpleBarContext = Uebersicht.React.createContext({
  settings: {},
  setSettings: () => {},
});

export const useSimpleBarContext = () =>
  Uebersicht.React.useContext(SimpleBarContext);

export default Uebersicht.React.memo(ContextProvider);

function ContextProvider({ initialSettings, children }) {
  const [settings, setSettings] = Uebersicht.React.useState(initialSettings);

  return (
    <SimpleBarContext.Provider value={{ settings, setSettings }}>
      {children}
    </SimpleBarContext.Provider>
  );
}
