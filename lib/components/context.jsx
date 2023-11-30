import * as Uebersicht from "uebersicht";

const SimpleBarContext = Uebersicht.React.createContext({});

export const useSimpleBarContext = () =>
  Uebersicht.React.useContext(SimpleBarContext);

export default Uebersicht.React.memo(ContextProvider);

function ContextProvider({ children }) {
  const [socket, setSocket] = Uebersicht.React.useState();

  Uebersicht.React.useEffect(() => {
    if (socket === undefined) {
      const runEffect = async () => {
        try {
          const newSocket = new WebSocket("ws://localhost:7777");
          newSocket.onmessage = (e) => {
            console.log(e);
          };
          setSocket(newSocket);
        } catch (e) {
          console.warn(e);
        }
      };
      runEffect();
    }
  }, [socket]);

  console.log(socket);

  return (
    <SimpleBarContext.Provider value={{}}>{children}</SimpleBarContext.Provider>
  );
}
