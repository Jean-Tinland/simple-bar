import * as Uebersicht from "uebersicht";
import * as Settings from "../settings";
import { useSimpleBarContext } from "../components/context.jsx";

export default function useServerSocket(
  widget,
  getter,
  resetWidget
  /*, userWidgetIndex */
) {
  const { settings, setSettings } = useSimpleBarContext();
  const { enableServer, serverSocketPort } = settings.global;
  const [socket, setSocket] = Uebersicht.React.useState(null);

  Uebersicht.React.useEffect(() => {
    if (enableServer && socket === null) {
      const newSocket = new WebSocket(
        `ws://localhost:${serverSocketPort}/?widget=${widget}`
      );
      newSocket.onmessage = (e) => {
        const { action } = JSON.parse(e.data);
        if (action === "refresh") {
          getter();
        }
        if (action === "toggle") {
          toggleWidget(widget, resetWidget, settings, setSettings);
        }
      };
      setSocket(newSocket);
    }
  }, [enableServer, serverSocketPort, socket]);
}

const settingsKeys = {
  battery: "batteryWidget",
  "browser-track": "browserTrackWidget",
  crypto: "cryptoWidget",
  "date-display": "dateWidget",
  keyboard: "keyboardWidget",
  mic: "micWidget",
  mpd: "mpdWidget",
  music: "musicWidget",
  netstats: "netstatsWidget",
  cpu: "cpuWidget",
  sound: "soundWidget",
  spotify: "spotifyWidget",
  stock: "stockWidget",
  time: "timeWidget",
  "viscosity-vpn": "vpnWidget",
  weather: "weatherWidget",
  wifi: "wifiWidget",
  zoom: "zoomWidget",
};

async function toggleWidget(widget, resetWidget, settings, setSettings) {
  const key = settingsKeys[widget];
  const { widgets } = settings;
  const active = !widgets[key];
  if (!active) {
    resetWidget();
  }
  const newSettings = {
    ...settings,
    widgets: { ...widgets, [key]: active },
  };
  await Settings.set(newSettings);
  setSettings(newSettings);
}
