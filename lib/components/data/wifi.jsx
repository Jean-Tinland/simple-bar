import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { wifiStyles as styles } from "../../styles/components/data/wifi";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 20000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, networkWidgetOptions } = settings;
  const { wifiWidget } = widgets;
  const {
    refreshFrequency,
    hideWifiIfDisabled,
    toggleWifiOnClick,
    networkDevice,
    hideNetworkName,
    showOnDisplay,
  } = networkWidgetOptions;
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && wifiWidget;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getWifi = React.useCallback(async () => {
    if (!visible) return;
    const [status, ssid] = await Promise.all([
      Uebersicht.run(`ifconfig ${networkDevice} | grep status | cut -c 10-`),
      Uebersicht.run(
        `networksetup -getairportnetwork ${networkDevice} | cut -c 24-`
      ),
    ]);
    setState({
      status: Utils.cleanupOutput(status),
      ssid: Utils.cleanupOutput(ssid),
    });
    setLoading(false);
  }, [networkDevice, visible]);

  useServerSocket("wifi", visible, getWifi, resetWidget);
  useWidgetRefresh(visible, getWifi, refresh);

  if (loading) return <DataWidgetLoader.Widget className="wifi" />;
  if (!state) return null;

  const { status, ssid } = state;
  const isActive = status === "active";
  const name = renderName(ssid, hideNetworkName);

  if (hideWifiIfDisabled && !isActive) return null;

  const classes = Utils.classnames("wifi", {
    "wifi--hidden-name": !name,
    "wifi--inactive": !isActive,
  });

  const Icon = isActive ? Icons.Wifi : Icons.WifiOff;

  const onClick = async (e) => {
    Utils.clickEffect(e);
    await toggleWifi(isActive, networkDevice);
    getWifi();
  };

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      onClick={toggleWifiOnClick ? onClick : undefined}
      onRightClick={openWifiPreferences}
    >
      {name}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Wifi";

async function toggleWifi(isActive, networkDevice) {
  if (isActive) {
    await Uebersicht.run(`networksetup -setairportpower ${networkDevice} off`);
    Utils.notification("Disabling network...");
  } else {
    await Uebersicht.run(`networksetup -setairportpower ${networkDevice} on`);
    Utils.notification("Enabling network...");
  }
}

function openWifiPreferences(e) {
  Utils.clickEffect(e);
  Uebersicht.run(`open /System/Library/PreferencePanes/Network.prefPane/`);
}

function renderName(name, hideNetworkName) {
  if (!name || hideNetworkName) return "";
  if (name === "with an AirPort network.y off.") return "Disabled";
  if (name === "with an AirPort network.") return "Searching...";
  return name;
}
