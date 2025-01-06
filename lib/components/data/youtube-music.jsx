import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";

export { youtubeMusicStyles as styles } from "../../styles/components/data/youtube-music";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const {
    widgets: { youtubeMusicWidget },
    youtubeMusicWidgetOptions: {
      refreshFrequency,
      showSpecter,
      showOnDisplay,
      youtubeMusicPort,
    },
  } = settings;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && youtubeMusicWidget;

  const [state, setState] = React.useState();
  const [cachedAccessToken, setCachedAccessToken] = React.useState();

  const apiUrl = `http://localhost:${youtubeMusicPort}`;

  const resetWidget = () => {
    setState(undefined);
    setCachedAccessToken(undefined);
  };

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
    [apiUrl, getAccessToken]
  );

  const refreshState = React.useCallback(async () => {
    if (!visible) return;

    try {
      const response = await fetchRoute("/api/v1/song-info", "GET");
      const json = await response.json();
      setState(json);
    } catch (e) {
      // most likely due to offline server, reset state
      resetWidget();
    }
  }, [visible, fetchRoute]);

  useServerSocket("youtube-music", visible, refreshState, resetWidget);
  useWidgetRefresh(visible, refreshState, refresh);

  const onClick = async (e) => {
    Utils.clickEffect(e);
    await fetchRoute("/api/v1/toggle-play");
    await refreshState();
  };
  const onRightClick = async (e) => {
    Utils.clickEffect(e);
    await fetchRoute("/api/v1/next");
    await refreshState();
  };
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
      Icon={Icon}
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

function getIcon(isPaused) {
  return isPaused ? Icons.Paused : Icons.Playing;
}
