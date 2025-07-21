import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { viscosityVPNStyles as styles } from "../../styles/components/data/viscosity-vpn";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 8000;

/**
 * Viscosity VPN Widget component.
 * @returns {JSX.Element|null} The Viscosity VPN widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings, pushMissive } = useSimpleBarContext();
  const { widgets, vpnWidgetOptions } = settings;
  const { vpnWidget } = widgets;
  const {
    refreshFrequency,
    vpnConnectionName,
    vpnShowConnectionName,
    showOnDisplay,
    showIcon,
  } = vpnWidgetOptions;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && vpnWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const [isViscosityActive, setIsViscosityActive] = React.useState(false);

  /**
   * Reset the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
    setIsViscosityActive(false);
  };

  /**
   * Fetch the current VPN status.
   */
  const getVPN = React.useCallback(async () => {
    if (!visible) return;
    const isRunning = await Uebersicht.run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "Viscosity"' 2>&1`,
    );
    if (Utils.cleanupOutput(isRunning) === "false") {
      setLoading(false);
      setIsViscosityActive(false);
      return;
    }
    const status = await Uebersicht.run(
      `osascript -e "tell application \\"Viscosity\\" to return state of the first connection where name is equal to \\"${vpnConnectionName}\\"" 2>/dev/null`,
    );
    if (!status.length) return;
    setState({ status: Utils.cleanupOutput(status) });
    setIsViscosityActive(true);
    setLoading(false);
  }, [visible, vpnConnectionName]);

  // Use server socket to listen for VPN status updates
  useServerSocket("viscosity-vpn", visible, getVPN, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getVPN, refresh);

  if (loading) return <DataWidgetLoader.Widget className="viscosity-vpn" />;
  if (!state || !vpnConnectionName.length || !isViscosityActive) return null;

  const { status } = state;
  const isConnected = status === "Connected";

  const classes = Utils.classNames("viscosity-vpn", {
    "viscosity-vpn--disconnected": !isConnected,
  });

  const Icon = isConnected ? Icons.VPN : Icons.VPNOff;

  /**
   * Handle click event to toggle VPN connection.
   * @param {Event} e - The click event.
   */
  const clicked = (e) => {
    Utils.clickEffect(e);
    toggleVPN(isConnected, vpnConnectionName, pushMissive);
    setTimeout(getVPN, refreshFrequency / 2);
  };

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Icon : null}
      onClick={clicked}
    >
      {vpnShowConnectionName ? vpnConnectionName : status}
    </DataWidget.Widget>
  );
});

Widget.displayName = "ViscosityVPN";

/**
 * Toggle the VPN connection.
 * @param {boolean} isConnected - Whether the VPN is currently connected.
 * @param {string} vpnConnectionName - The name of the VPN connection.
 * @param {function} pushMissive - Function to push notifications.
 */
function toggleVPN(isConnected, vpnConnectionName, pushMissive) {
  if (isConnected) {
    Uebersicht.run(
      `osascript -e 'tell application "Viscosity" to disconnect "${vpnConnectionName}"'`,
    );
    Utils.notification(
      `Disabling Viscosity ${vpnConnectionName} network...`,
      pushMissive,
    );
  } else {
    Uebersicht.run(
      `osascript -e 'tell application "Viscosity" to connect "${vpnConnectionName}"'`,
    );
    Utils.notification(
      `Enabling Viscosity ${vpnConnectionName} network...`,
      pushMissive,
    );
  }
}
