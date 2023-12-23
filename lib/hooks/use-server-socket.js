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
    const isUserWidget = widget === "user-widget";
    if (enableServer && socket === null) {
      let queryParams = `widget=${widget}`;

      if (userWidgetIndex !== undefined) {
        queryParams = queryParams.concat(`&userWidgetIndex=${userWidgetIndex}`);
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
          if (isUserWidget) {
            toggleUserWidget(
              userWidgetIndex,
              resetWidget,
              settings,
              setSettings
            );
          } else {
            toggleWidget(widget, resetWidget, settings, setSettings);
          }
        }
      };

      setSocket(newSocket);
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

async function toggleUserWidget(index, resetWidget, settings, setSettings) {
  const { userWidgetsList = {} } = settings.userWidgets;
  const active = !userWidgetsList[index].active;
  if (!active) {
    resetWidget();
  }
  const newUserWidgetsList = {
    ...userWidgetsList,
    [index]: { ...userWidgetsList[index], active },
  };

  const newSettings = {
    ...settings,
    userWidgets: {
      ...settings.userWidgets,
      userWidgetsList: newUserWidgetsList,
    },
  };

  await Settings.set(newSettings);
  setSettings(newSettings);
}
