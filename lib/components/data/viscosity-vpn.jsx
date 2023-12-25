import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { viscosityVPNStyles as styles } from "../../styles/components/data/viscosity-vpn";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 8000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, vpnWidgetOptions } = settings;
  const { vpnWidget } = widgets;
  const {
    refreshFrequency,
    vpnConnectionName,
    vpnShowConnectionName,
    showOnDisplay,
  } = vpnWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && vpnWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getVPN = React.useCallback(async () => {
    if (!visible) return;
    const isRunning = await Uebersicht.run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "Viscosity"' 2>&1`
    );
    if (Utils.cleanupOutput(isRunning) === "false") {
      setLoading(false);
      return;
    }
    const status = await Uebersicht.run(
      `osascript -e "tell application \\"Viscosity\\" to return state of the first connection where name is equal to \\"${vpnConnectionName}\\"" 2>/dev/null`
    );
    if (!status.length) return;
    setState({ status: Utils.cleanupOutput(status) });
    setLoading(false);
  }, [visible, vpnConnectionName]);

  useServerSocket("viscosity-vpn", visible, getVPN, resetWidget);
  useWidgetRefresh(visible, getVPN, refresh);

  if (loading) return <DataWidgetLoader.Widget className="viscosity-vpn" />;
  if (!state || !vpnConnectionName.length) return null;

  const { status } = state;
  const isConnected = status === "Connected";

  const classes = Utils.classnames("viscosity-vpn", {
    "viscosity-vpn--disconnected": !isConnected,
  });

  const Icon = isConnected ? Icons.VPN : Icons.VPNOff;

  const clicked = (e) => {
    Utils.clickEffect(e);
    toggleVPN(isConnected, vpnConnectionName);
    setTimeout(getVPN, refreshFrequency / 2);
  };

  return (
    <DataWidget.Widget classes={classes} Icon={Icon} onClick={clicked}>
      {vpnShowConnectionName ? vpnConnectionName : status}
    </DataWidget.Widget>
  );
});

Widget.displayName = "ViscosityVPN";

function toggleVPN(isConnected, vpnConnectionName) {
  if (isConnected) {
    Uebersicht.run(
      `osascript -e 'tell application "Viscosity" to disconnect "${vpnConnectionName}"'`
    );
    Utils.notification(`Disabling Viscosity ${vpnConnectionName} network...`);
  } else {
    Uebersicht.run(
      `osascript -e 'tell application "Viscosity" to connect "${vpnConnectionName}"'`
    );
    Utils.notification(`Enabling Viscosity ${vpnConnectionName} network...`);
  }
}
