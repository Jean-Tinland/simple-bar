import * as Uebersicht from "uebersicht";
import * as Settings from "../settings";
import { useSimpleBarContext } from "../components/simple-bar-context.jsx";

const { React } = Uebersicht;

/**
 * Custom hook to manage server socket connections and handle incoming messages.
 *
 * @param {string} target - The target widget to manage.
 * @param {boolean} visible - Visibility state of the widget.
 * @param {function} getter - Function to handle data retrieval.
 * @param {function} resetWidget - Function to reset the widget state.
 * @param {function} setLoading - Function to set the loading state.
 * @param {number} [userWidgetIndex] - Index of the user widget (if applicable).
 *
 * @returns {void}
 */
export default function useServerSocket(
  target,
  visible,
  getter,
  resetWidget,
  setLoading,
  userWidgetIndex,
) {
  const { settings, setSettings } = useSimpleBarContext();
  const { enableServer, serverSocketPort } = settings.global;
  const socket = React.useRef(null);

  const isUserWidget = target === "user-widget";

  /**
   * Handles incoming WebSocket messages and performs actions based on the message content.
   * @param {Object} e - The event object containing the message data.
   * @param {string} e.data - The JSON string containing the action and data.
   * @param {string} e.data.action - The action to perform (e.g., "push", "refresh", "disable", "enable", "toggle").
   * @param {Object} e.data.data - The data associated with the action.
   */
  const handleMessage = React.useCallback(
    (e) => {
      const { action, data } = JSON.parse(e.data);

      if (action === "push" || (visible && action === "refresh")) {
        getter(data);
      }

      if (action === "disable" || action === "enable") {
        const state = action === "enable";

        if (isUserWidget) {
          toggleUserWidget(
            userWidgetIndex,
            resetWidget,
            setSettings,
            state,
            setLoading,
          );
        } else {
          toggleWidget(target, resetWidget, setSettings, state, setLoading);
        }
      }

      if (action === "toggle") {
        if (isUserWidget) {
          toggleUserWidget(
            userWidgetIndex,
            resetWidget,
            setSettings,
            undefined,
            setLoading,
          );
        } else {
          toggleWidget(target, resetWidget, setSettings, undefined, setLoading);
        }
      }
    },
    [
      getter,
      isUserWidget,
      resetWidget,
      setLoading,
      setSettings,
      target,
      userWidgetIndex,
      visible,
    ],
  );

  React.useEffect(() => {
    // If the server is enabled, create a new WebSocket connection
    if (enableServer) {
      // If the socket is not already created, create a new one
      if (socket.current === null) {
        let queryParams = `target=${target}`;

        if (userWidgetIndex !== undefined) {
          queryParams = queryParams.concat(
            `&userWidgetIndex=${userWidgetIndex}`,
          );
        }

        const newSocket = new WebSocket(
          `ws://localhost:${serverSocketPort}/?${queryParams}`,
        );

        newSocket.onmessage = handleMessage;
        socket.current = newSocket;
      }
    } else {
      // If the server is disabled, close the socket if it exists
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    }
  }, [enableServer, handleMessage, serverSocketPort, target, userWidgetIndex]);
}

const settingsKeys = {
  battery: "batteryWidget",
  "browser-track": "browserTrackWidget",
  cpu: "cpuWidget",
  crypto: "cryptoWidget",
  "date-display": "dateWidget",
  gpu: "gpuWidget",
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
  memory: "memoryWidget",
  "youtube-music": "youtubeMusicWidget",
  zoom: "zoomWidget",
};

/**
 * Toggles the state of a widget and updates the settings accordingly.
 *
 * @param {string} widget - The name of the widget to toggle.
 * @param {Function} resetWidget - A function to reset the widget state, if needed.
 * @param {Function} setSettings - A function to update the settings state.
 * @param {boolean} [forcedState] - An optional parameter to force the widget state.
 * @param {Function} setLoading - A function to set the loading state.
 * @returns {Promise<void>} - A promise that resolves when the widget state is toggled.
 */
async function toggleWidget(
  widget,
  resetWidget,
  setSettings,
  forcedState,
  setLoading,
) {
  const key = settingsKeys[widget];
  setSettings((settings) => {
    const { widgets } = settings;
    const active = forcedState ?? !widgets[key];
    if (!active) {
      resetWidget?.();
    } else {
      setLoading?.(true);
    }
    const newSettings = {
      ...settings,
      widgets: { ...widgets, [key]: active },
    };
    Settings.set(newSettings);
    return newSettings;
  });
}

/**
 * Toggles the active state of a user widget.
 *
 * @param {number} index - The index of the user widget to toggle.
 * @param {Function} resetWidget - A function to reset the widget, called when the widget is deactivated.
 * @param {Function} setSettings - A function to update the settings state.
 * @param {boolean} [forcedState] - An optional boolean to force the widget's active state.
 * @param {Function} setLoading - A function to set the loading state, called when the widget is activated.
 * @returns {Promise<void>} A promise that resolves when the settings have been updated.
 */
async function toggleUserWidget(
  index,
  resetWidget,
  setSettings,
  forcedState,
  setLoading,
) {
  setSettings((settings) => {
    const { userWidgetsList = {} } = settings.userWidgets;
    const active = forcedState ?? !userWidgetsList[index].active;
    if (!active) {
      resetWidget?.();
    } else {
      setLoading?.(true);
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
