import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { wifiStyles as styles } from "../../styles/components/data/wifi";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 20000;

/**
 * Wifi widget component.
 * @returns {JSX.Element|null} The Wifi widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings, pushMissive } = useSimpleBarContext();
  const { widgets, networkWidgetOptions } = settings;
  const { wifiWidget } = widgets;
  const {
    refreshFrequency,
    hideWifiIfDisabled,
    toggleWifiOnClick,
    networkDevice,
    hideNetworkName,
    showOnDisplay,
    showIcon,
  } = networkWidgetOptions;
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && wifiWidget;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

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
   * Fetches the wifi status and SSID.
   */
  const getWifi = React.useCallback(async () => {
    if (!visible) return;
    const [status, ssid] = await Promise.all([
      Uebersicht.run(`ifconfig ${networkDevice} | grep status | cut -c 10-`),
      Uebersicht.run(
        `system_profiler SPAirPortDataType | awk '/Current Network/ {getline;$1=$1;print $0 | "tr -d ':'";exit}'`,
      ),
    ]);
    setState({
      status: Utils.cleanupOutput(status),
      ssid: Utils.cleanupOutput(ssid),
    });
    setLoading(false);
  }, [networkDevice, visible]);

  useServerSocket("wifi", visible, getWifi, resetWidget, setLoading);
  useWidgetRefresh(visible, getWifi, refresh);

  if (loading) return <DataWidgetLoader.Widget className="wifi" />;
  if (!state) return null;

  const { status, ssid } = state;
  const isActive = status === "active";
  const name = renderName(ssid, hideNetworkName);

  if (hideWifiIfDisabled && !isActive) return null;

  const classes = Utils.classNames("wifi", {
    "wifi--hidden-name": !name,
    "wifi--inactive": !isActive,
  });

  const Icon = isActive ? Icons.Wifi : Icons.WifiOff;

  /**
   * Handles the click event to toggle wifi.
   * @param {React.MouseEvent} e - The click event.
   */
  const onClick = async (e) => {
    Utils.clickEffect(e);
    await toggleWifi(isActive, networkDevice, pushMissive);
    getWifi();
  };

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Icon : null}
      onClick={toggleWifiOnClick ? onClick : undefined}
      onRightClick={openWifiPreferences}
    >
      {name}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Wifi";

/**
 * Toggles the wifi on or off.
 * @param {boolean} isActive - Whether the wifi is currently active.
 * @param {string} networkDevice - The network device name.
 * @param {function} pushMissive - Function to push notifications.
 */
async function toggleWifi(isActive, networkDevice, pushMissive) {
  if (isActive) {
    await Uebersicht.run(`networksetup -setairportpower ${networkDevice} off`);
    Utils.notification("Disabling network...", pushMissive);
  } else {
    await Uebersicht.run(`networksetup -setairportpower ${networkDevice} on`);
    Utils.notification("Enabling network...", pushMissive);
  }
}

/**
 * Opens the wifi preferences pane.
 * @param {React.MouseEvent} e - The click event.
 */
function openWifiPreferences(e) {
  Utils.clickEffect(e);
  Uebersicht.run(`open /System/Library/PreferencePanes/Network.prefPane/`);
}

/**
 * Renders the wifi network name.
 * @param {string} name - The network name.
 * @param {boolean} hideNetworkName - Whether to hide the network name.
 * @returns {string} The rendered network name.
 */
function renderName(name, hideNetworkName) {
  if (!name || hideNetworkName) return "";
  if (name === "with an AirPort network.y off.") return "Disabled";
  if (name === "with an AirPort network.") return "Searching...";
  return name;
}
