import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import * as Settings from "../../settings";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";

export { keyboardStyles as styles } from "../../styles/components/data/keyboard";

const settings = Settings.get();
const { widgets, keyboardWidgetOptions } = settings;
const { keyboardWidget } = widgets;
const { refreshFrequency, showOnDisplay } = keyboardWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 20000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

export const Widget = ({ display }) => {
  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && keyboardWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const getKeyboard = async () => {
    const keyboard = await Uebersicht.run(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | awk '/KeyboardLayout Name/ {print $4}'`
    );
    const layout = Utils.cleanupOutput(keyboard).replace(";", "");
    if (layout.length) {
      setState({ keyboard: layout });
      setLoading(false);
      return;
    }

    const inputMode = await Uebersicht.run(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | awk '/"Input Mode" =/ {print $4}'`
    );
    const cleanedInputMode = Utils.cleanupOutput(inputMode)
      .replace(/"com.apple.inputmethod.(.*)"/, "$1")
      .replace(";", "");

    if (!cleanedInputMode.length) return setLoading(false);

    const splitedInputMode = cleanedInputMode.split(".");
    const inputModeName = splitedInputMode[splitedInputMode.length - 1];
    setState({ keyboard: inputModeName });
    setLoading(false);
  };

  useWidgetRefresh(visible, getKeyboard, REFRESH_FREQUENCY);

  if (loading) return <DataWidgetLoader.Widget className="keyboard" />;
  if (!state) return null;
  const { keyboard } = state;

  if (!keyboard?.length) return null;

  return (
    <DataWidget.Widget classes="keyboard" Icon={Icons.Keyboard}>
      {keyboard}
    </DataWidget.Widget>
  );
};
