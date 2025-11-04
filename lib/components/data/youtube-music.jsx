import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";

export { youtubeMusicStyles as styles } from "../../styles/components/data/youtube-music";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

/**
 * YouTube Music Widget component.
 * @returns {JSX.Element} The YouTube Music widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const {
    widgets: { youtubeMusicWidget },
    youtubeMusicWidgetOptions: {
      refreshFrequency,
      showSpecter,
      showOnDisplay,
      youtubeMusicPort,
      showIcon,
    },
  } = settings;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible on the current display
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && youtubeMusicWidget;

  const [state, setState] = React.useState();
  const [cachedAccessToken, setCachedAccessToken] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const apiUrl = `http://localhost:${youtubeMusicPort}`;

  /**
   * Resets the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setCachedAccessToken(undefined);
    setLoading(false);
  };

  /**
   * Fetches the access token for the YouTube Music API.
   * @returns {Promise<string>} The access token.
   */
  const getAccessToken = React.useCallback(async () => {
    // As of 2024/12/01, the generated access tokens don't expire
    if (cachedAccessToken) return cachedAccessToken;

    const response = await fetch(`${apiUrl}/auth/simple-bar`, {
      method: "POST",
    });
    const json = await response.json();
    setCachedAccessToken(json.accessToken);
    return json.accessToken;
  }, [apiUrl, cachedAccessToken]);

  /**
   * Fetches data from a specified route.
   * @param {string} route - The API route to fetch data from.
   * @param {string} [method="POST"] - The HTTP method to use.
   * @returns {Promise<Response>} The fetch response.
   */
  const fetchRoute = React.useCallback(
    async (route, method = "POST") => {
      const headers = {};
      const url = new URL(route, apiUrl);

      // All routes under /api are protected
      const needsAuthentication = url.pathname.startsWith("/api");
      if (needsAuthentication) {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Failed to get access token");
        }
        headers.Authorization = `Bearer ${accessToken}`;
      }

      return await fetch(url, { method, headers });
    },
    [apiUrl, getAccessToken],
  );

  /**
   * Refreshes the widget state by fetching the current song info.
   */
  const refreshState = React.useCallback(async () => {
    if (!visible) return;

    try {
      const response = await fetchRoute("/api/v1/song-info", "GET");
      const json = await response.json();
      setState(json);
    } catch {
      // most likely due to offline server, reset state
      resetWidget();
    }
  }, [visible, fetchRoute]);

  // Use server socket to listen for updates
  useServerSocket(
    "youtube-music",
    visible,
    refreshState,
    resetWidget,
    setLoading,
  );
  // Use widget refresh hook to periodically refresh the state
  useWidgetRefresh(visible, refreshState, refresh);

  if (loading) return <DataWidgetLoader.Widget className="youtube-music" />;

  /**
   * Handles click event to toggle play/pause.
   * @param {React.MouseEvent} e - The click event.
   */
  const onClick = async (e) => {
    Utils.clickEffect(e);
    await fetchRoute("/api/v1/toggle-play");
    await refreshState();
  };

  /**
   * Handles right-click event to skip to the next song.
   * @param {React.MouseEvent} e - The right-click event.
   */
  const onRightClick = async (e) => {
    Utils.clickEffect(e);
    await fetchRoute("/api/v1/next");
    await refreshState();
  };

  /**
   * Handles middle-click event to open YouTube Music app.
   * @param {React.MouseEvent} e - The middle-click event.
   */
  const onMiddleClick = async (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`open -a 'YouTube Music'`);
    await refreshState();
  };

  const classes = Utils.classNames("youtube-music", {});
  if (!state) return null;
  const { title, artist, isPaused } = state;
  if (!title) return null;

  const label = artist.length ? `${title} - ${artist}` : title;
  const Icon = getIcon(isPaused);

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Icon : null}
      onClick={onClick}
      onRightClick={onRightClick}
      onMiddleClick={onMiddleClick}
      showSpecter={showSpecter && !isPaused}
    >
      {label}
    </DataWidget.Widget>
  );
});

Widget.displayName = "YouTube Music";

/**
 * Returns the appropriate icon based on the play/pause state.
 * @param {boolean} isPaused - Whether the music is paused.
 * @returns {JSX.Element} The icon component.
 */
function getIcon(isPaused) {
  return isPaused ? Icons.Paused : Icons.Playing;
}
