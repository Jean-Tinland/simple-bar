import * as Uebersicht from "uebersicht";
import * as Aerospace from "../aerospace.js";

const { React } = Uebersicht;

// Create a context with default values
const SimpleBarContext = React.createContext({
  display: 1,
  SIPDisabled: false,
  settings: {},
  setSettings: () => {},
});

/**
 * Custom hook to use the SimpleBarContext
 * @returns {Object} The context value
 */
export function useSimpleBarContext() {
  return React.useContext(SimpleBarContext);
}

/**
 * Provides context for simple-bar.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.initialSettings - The initial settings for the application.
 * @param {Array} props.displays - The initial displays configuration.
 * @param {boolean} props.SIPDisabled - Indicates if SIP (System Integrity Protection) is disabled.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 *
 * @returns {JSX.Element} The context provider component.
 */
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
  const isAeroSpace = windowManager === "aerospace";

  const currentDisplays = serverEnabled && isYabai ? _displays : displays;

  const ubersichtDisplayId = parseInt(
    window.location.pathname.replace("/", ""),
    10
  );

  // Check if the built-in Retina Display is present in the current displays
  const hasBuiltInRetina = currentDisplays?.some(
    (d) => d["monitor-name"] === "Built-in Retina Display"
  );

  // Adjust displayId if the Retina screen is missing when using AeroSpace
  // This prevents mismatch between Übersicht and AeroSpace display numbering
  // as Übersicht still count closed built in screen in the display count
  const adjustedUbersichtDisplayId =
    isAeroSpace && !hasBuiltInRetina
      ? ubersichtDisplayId - 1
      : ubersichtDisplayId;

  // Find the current display based on the adjusted display ID
  // Use Aerospace's display index if available (check for custom logic)
  // Fallback to yabai id otherwise
  const currentDisplay =
    currentDisplays?.find((d) => {
      const id = Aerospace.getDisplayIndex(d) ?? d.id;
      return id === adjustedUbersichtDisplayId;
    }) || {};

  // Determine the display index for context value
  // currentDisplay.index is from yabai
  // Aerospace.getDisplayIndex is from Aerospace with custom logic
  // Fallback to Aerospace monitor-id or default to 1
  const displayIndex =
    (currentDisplay.index ?? Aerospace.getDisplayIndex(currentDisplay)) || 1;

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
        displays: currentDisplays,
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
