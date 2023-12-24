import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";
import * as Settings from "../../settings";

export { settingsStyles as styles } from "../../styles/components/settings/settings";

const { React } = Uebersicht;

const Component = React.lazy(() => import("./settings-component.jsx"));

export function Wrapper() {
  const [visible, setVisible] = React.useState(false);

  const closeSettings = () => {
    setVisible(false);
    Utils.blurBar();
  };
  const onKeydown = (e) => {
    const { ctrlKey, keyCode, metaKey, which } = e;
    if ((ctrlKey || metaKey) && (which === 188 || keyCode === 188)) {
      e.preventDefault();
      setVisible(true);
    }
    if ((ctrlKey || metaKey) && (which === 84 || keyCode === 84)) {
      const settings = Settings.get();
      e.preventDefault();
      const AUTO = "auto";
      const DARK = "dark";
      const LIGHT = "light";
      const newValue =
        settings.global.theme === AUTO
          ? AUTO
          : settings.global.theme === LIGHT
          ? DARK
          : LIGHT;
      Uebersicht.run(
        `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'`
      );
      if (newValue !== AUTO) {
        const updatedSettings = {
          ...settings,
          global: { ...settings.global, theme: newValue },
        };
        Settings.set(updatedSettings);
        Utils.hardRefresh();
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

  return (
    <React.Fragment>
      {visible && (
        <React.Suspense fallback={""}>
          <Component visible={visible} closeSettings={closeSettings} />
        </React.Suspense>
      )}
    </React.Fragment>
  );
}
