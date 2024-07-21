import * as Uebersicht from "uebersicht";
import * as Settings from "../settings";
import { useSimpleBarContext } from "../components/simple-bar-context.jsx";

const { React } = Uebersicht;

export default function useServerSocket(
  target,
  visible,
  getter,
  resetWidget,
  userWidgetIndex
) {
  const { settings, setSettings } = useSimpleBarContext();
  const { enableServer, serverSocketPort } = settings.global;
  const socket = React.useRef(null);

  const isUserWidget = target === "user-widget";

  const handleMessage = React.useCallback(
    (e) => {
      const { action } = JSON.parse(e.data);

      if (visible && action === "refresh") {
        getter();
      }

      if (action === "disable" || action === "enable") {
        const state = action === "enable";

        if (isUserWidget) {
          toggleUserWidget(userWidgetIndex, resetWidget, setSettings, state);
        } else {
          toggleWidget(target, resetWidget, setSettings, state);
        }
      }

      if (action === "toggle") {
        if (isUserWidget) {
          toggleUserWidget(userWidgetIndex, resetWidget, setSettings);
        } else {
          toggleWidget(target, resetWidget, setSettings);
        }
      }
    },
    [
      getter,
      isUserWidget,
      resetWidget,
      setSettings,
      target,
      userWidgetIndex,
      visible,
    ]
  );

  React.useEffect(() => {
    if (enableServer && socket.current === null) {
      let queryParams = `target=${target}`;

      if (userWidgetIndex !== undefined) {
        queryParams = queryParams.concat(`&userWidgetIndex=${userWidgetIndex}`);
      }

      const newSocket = new WebSocket(
        `ws://localhost:${serverSocketPort}/?${queryParams}`
      );

      newSocket.onmessage = handleMessage;

      socket.current = newSocket;
    }
  }, [enableServer, handleMessage, serverSocketPort, target, userWidgetIndex]);
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

async function toggleWidget(widget, resetWidget, setSettings, forcedState) {
  const key = settingsKeys[widget];
  setSettings((settings) => {
    const { widgets } = settings;
    const active = forcedState ?? !widgets[key];
    if (!active) {
      resetWidget?.();
    }
    const newSettings = {
      ...settings,
      widgets: { ...widgets, [key]: active },
    };
    Settings.set(newSettings);
    return newSettings;
  });
}

async function toggleUserWidget(index, resetWidget, setSettings, forcedState) {
  setSettings((settings) => {
    const { userWidgetsList = {} } = settings.userWidgets;
    const active = forcedState ?? !userWidgetsList[index].active;
    if (!active) {
      resetWidget?.();
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
    Settings.set(newSettings);
    return newSettings;
  });
}
