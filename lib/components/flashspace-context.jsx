import * as Uebersicht from "uebersicht";
import { useSimpleBarContext } from "./simple-bar-context.jsx";
import useServerSocket from "../hooks/use-server-socket.js";
import * as Flashspace from "../flashspace.js";

const { React } = Uebersicht;

// Create a context with default value
const FlashspaceContext = React.createContext({
  workspaces: [],
  currentWorkSpace: "",
});

/**
 * Custom hook to use the FlashspaceContext
 * @returns {Object} The context value
 */
export function useFlashspaceContext() {
  return React.useContext(FlashspaceContext);
}

// Memoized FlashspaceContextProvider component
export default React.memo(FlashspaceContextProvider);

/**
 * FlashspaceContextProvider component
 * @param {Object} props - The component props
 * @param {Object} props.config - The FlashSpace config
 * @param {React.ReactNode} props.children - The child components
 * @returns {JSX.Element} The provider component
 */
function FlashspaceContextProvider({ config, currentWorkspace, children }) {
  const { settings } = useSimpleBarContext();
  const { enableServer, flashspaceServerRefresh } = settings.global;
  const serverEnabled = enableServer && flashspaceServerRefresh;

  const [flashspaceConfig, setFlashspaceConfig] = React.useState(config);
  const [flashspaceCurrentWorkspace, setFlashspaceCurrentWorkspace] =
    React.useState(currentWorkspace);

  const { selectedProfileId, profiles } = serverEnabled
    ? flashspaceConfig
    : config;
  const { workspaces = [] } =
    profiles.find((p) => p.id === selectedProfileId) || {};

  // Resets the config state to an empty object.
  const resetConfig = () => {
    setFlashspaceConfig({});
  };

  // Resets the current workspace state to an empty string.
  const resetWorkspace = () => {
    setFlashspaceCurrentWorkspace("");
  };

  // Fetches the Flashspace config and sets the state.
  const getConfig = async () => {
    const config = await Flashspace.getConfig();
    setFlashspaceConfig(config);
  };

  // Fetches the current workspace and sets the state.
  const getWorkspace = async () => {
    const workspace = await Flashspace.getCurrentWorkspace();
    setFlashspaceCurrentWorkspace(workspace);
  };

  useServerSocket("config", serverEnabled, getConfig, resetConfig);
  useServerSocket("workspace", serverEnabled, getWorkspace, resetWorkspace);

  return (
    <FlashspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace: serverEnabled
          ? flashspaceCurrentWorkspace
          : currentWorkspace,
      }}
    >
      {children}
    </FlashspaceContext.Provider>
  );
}
