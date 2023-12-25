import * as Uebersicht from "uebersicht";

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
  return (
    <YabaiContext.Provider value={{ spaces, windows, skhdMode }}>
      {children}
    </YabaiContext.Provider>
  );
}
