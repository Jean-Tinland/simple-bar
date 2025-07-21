import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";
import * as Settings from "../../settings";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { settingsStyles as styles } from "../../styles/components/settings/settings";

const { React } = Uebersicht;

// Settings component is lazy loaded. That way,
// it isn't loaded everytime simple-bar is refreshed
const Component = React.lazy(() => import("./settings-component.jsx"));

/**
 * Wrapper component that handles keyboard shortcuts for various actions
 * and manages the visibility of the settings component.
 *
 * @component
 * @returns {React.Fragment} A fragment containing the settings component if visible.
 */
export function Wrapper() {
  const { pushMissive } = useSimpleBarContext();
  const [visible, setVisible] = React.useState(false);

  const closeSettings = () => {
    setVisible(false);
    Utils.blurBar();
  };

  // Actions handled by this function are
  // > Hard refresh simple-bar with cmd/ctrl + r
  // > Open settings with cmd/ctrl + ,
  // > Toggle dark theme with cmd/ctrl + t
  const handleKeydown = React.useCallback(
    (e) => {
      const { ctrlKey, key, metaKey } = e;
      if ((ctrlKey || metaKey) && key === "r") {
        e.preventDefault();
        Utils.hardRefresh();
      }
      if ((ctrlKey || metaKey) && key === ",") {
        e.preventDefault();
        setVisible(true);
      }
      if ((ctrlKey || metaKey) && key === "t") {
        e.preventDefault();
        // We retrieve the latest version of settings
        const settings = Settings.get();
        const AUTO = "auto";
        // If current value is auto, it is stored as is
        // otherwise, it is toggled
        let newValue = AUTO;
        if (settings.global.theme !== AUTO) {
          newValue = settings.global.theme;
        }
        // OS is instructed to toggle dark theme
        Uebersicht.run(
          `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'`,
        );
        // A notification is pushed either in Macos notification center or via internal missives system
        Utils.notification("Toggling dark theme...", pushMissive);
        if (newValue !== AUTO) {
          // Only theme value is updated
          const updatedSettings = {
            ...settings,
            global: { ...settings.global, theme: newValue },
          };
          // Settings are updated and simple-bar is hard refreshed
          Settings.set(updatedSettings);
          Utils.hardRefresh();
        }
      }
    },
    [pushMissive],
  );

  React.useEffect(() => {
    // We bind keydown event on Übersicht document when <Settings /> component is mounted
    // Event listener is removed on unmount
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  // Only a fragment is returned if <Settings /> component is not visible
  return (
    <React.Fragment>
      {visible && (
        <React.Suspense fallback={<React.Fragment />}>
          <Component visible={visible} closeSettings={closeSettings} />
        </React.Suspense>
      )}
    </React.Fragment>
  );
}
