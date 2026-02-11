import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { keyboardStyles as styles } from "../../styles/components/data/keyboard";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 20000;

/**
 * Keyboard widget component.
 * @returns {JSX.Element|null} The rendered widget or null if not visible.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, keyboardWidgetOptions } = settings;
  const { keyboardWidget } = widgets;
  const { refreshFrequency, showOnDisplay, showIcon, keyboardMaxLength } =
    keyboardWidgetOptions;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible based on display settings
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && keyboardWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  /**
   * Resets the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetches the current keyboard layout or input mode.
   */
  const getKeyboard = React.useCallback(async () => {
    if (!visible) return;
    const keyboard = await Utils.cachedRun(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | awk '/KeyboardLayout Name/ {$1=$2=$3=""; print $0}'`,
      refresh,
    );
    const layout = Utils.cleanupOutput(keyboard)
      .replace(";", "")
      .replaceAll('"', "");
    if (layout.length) {
      setState({ keyboard: layout });
      setLoading(false);
      return;
    }

    const inputMode = await Utils.cachedRun(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | awk '/"Input Mode" =/ {$1=$2=$3=""; print $0}'`,
      refresh,
    );
    const cleanedInputMode = Utils.cleanupOutput(inputMode)
      .replace(/"com.apple.inputmethod.(.*)"/, "$1")
      .replace(";", "");

    if (!cleanedInputMode.length) return setLoading(false);

    const splitedInputMode = cleanedInputMode.split(".");
    const inputModeName = splitedInputMode[splitedInputMode.length - 1];
    setState({ keyboard: inputModeName });
    setLoading(false);
  }, [visible, refresh]);

  // Use server socket to listen for keyboard events
  useServerSocket("keyboard", visible, getKeyboard, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getKeyboard, refresh);

  if (loading) return <DataWidgetLoader.Widget className="keyboard" />;
  if (!state) return null;
  const { keyboard } = state;

  const maxLength = Number(keyboardMaxLength) || 0;
  const displayKeyboard =
    maxLength > 0 ? keyboard.slice(0, maxLength) : keyboard;

  if (!displayKeyboard?.length) return null;

  return (
    <DataWidget.Widget
      classes="keyboard"
      Icon={showIcon ? Icons.Keyboard : null}
    >
      {displayKeyboard}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Keyboard";
