import * as Uebersicht from "uebersicht";

const SimpleBarContext = Uebersicht.React.createContext({});

export const useSimpleBarContext = () =>
  Uebersicht.React.useContext(SimpleBarContext);

export default function ContextProvider({ children }) {
  const [socket, setSocket] = Uebersicht.React.useState(null);

  Uebersicht.React.useEffect(() => {
    if (socket === null) {
      try {
        const newSocket = new WebSocket("ws://localhost:7777");
        newSocket.onmessage = (e) => {
          console.log(e);
        };
        setSocket(newSocket);
      } catch (e) {
        setSocket(false);
      }
    }
  }, []);

  return (
    <SimpleBarContext.Provider value={{}}>{children}</SimpleBarContext.Provider>
  );
}
