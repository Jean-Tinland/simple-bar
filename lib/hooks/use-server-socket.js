import * as Uebersicht from "uebersicht";
import * as Settings from "../settings";
import { useSimpleBarContext } from "../components/context.jsx";

export default function useServerSocket(
  widget,
  visible,
  getter,
  resetWidget,
  userWidgetIndex
) {
  const { settings, setSettings } = useSimpleBarContext();
  const { enableServer, serverSocketPort } = settings.global;
  const [socket, setSocket] = Uebersicht.React.useState(null);

  Uebersicht.React.useEffect(() => {
    try {
      if (enableServer && socket === null) {
        let queryParams = `widget=${widget}`;

        if (userWidgetIndex !== undefined) {
          queryParams = queryParams.concat(
            `&userWidgetIndex=${userWidgetIndex}`
          );
        }

        const newSocket = new WebSocket(
          `ws://localhost:${serverSocketPort}/?${queryParams}`
        );

        newSocket.onmessage = (e) => {
          const { action } = JSON.parse(e.data);
          if (visible && action === "refresh") {
            getter();
          }
          if (action === "toggle") {
            toggleWidget(widget, resetWidget, settings, setSettings);
          }
        };
        setSocket(newSocket);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("simple-bar-server not reachable: ", e);
    }
  }, [enableServer, serverSocketPort, socket, visible]);
}

const settingsKeys = {
  battery: "batteryWidget",
  "browser-track": "browserTrackWidget",
  cpu: "cpuWidget",
  crypto: "cryptoWidget",
  "date-display": "dateWidget",
  keyboard: "keyboardWidget",
  mic: "micWidget",
  mpd: "mpdWidget",
  music: "musicWidget",
  netstats: "netstatsWidget",
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
