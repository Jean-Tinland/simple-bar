import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../context.jsx";
import * as Utils from "../../utils";

export { mpdStyles as styles } from "../../styles/components/data/mpd";

const DEFAULT_REFRESH_FREQUENCY = 10000;

export const Widget = Uebersicht.React.memo(() => {
  const { display, settings } = useSimpleBarContext();
  const { widgets, mpdWidgetOptions } = settings;
  const { mpdWidget } = widgets;
  const {
    refreshFrequency,
    showSpecter,
    mpdHost,
    mpdPort,
    mpdFormatString,
    showOnDisplay,
  } = mpdWidgetOptions;

  const refresh = Uebersicht.React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible = Utils.isVisibleOnDisplay(display, showOnDisplay) && mpdWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getMpd = Uebersicht.React.useCallback(async () => {
    if (!visible) return;
    try {
      const [playerState, trackInfo] = await Promise.all([
        Uebersicht.run(
          `mpc --host ${mpdHost} --port ${mpdPort} | head -n 2 | tail -n 1 | awk '{print substr($1,2,length($1)-2)}' 2>/dev/null || echo "stopped"`
        ),
        Uebersicht.run(
          `mpc --host ${mpdHost} --port ${mpdPort} --format "${mpdFormatString}" | head -n 1`
        ),
      ]);
      if (Utils.cleanupOutput(trackInfo) === "") {
        setLoading(false);
        return;
      }
      setState({
        playerState: Utils.cleanupOutput(playerState),
        trackInfo: Utils.cleanupOutput(trackInfo),
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [visible]);

  useServerSocket("mpd", visible, getMpd, resetWidget);
  useWidgetRefresh(visible, getMpd, refresh);

  if (loading) return <DataWidgetLoader.Widget className="mpd" />;
  if (!state) return null;
  const { playerState, trackInfo } = state;

  if (!trackInfo.length) return null;

  const isPlaying = playerState === "playing";
  const Icon = isPlaying ? Icons.Playing : Icons.Paused;

  const onClick = async (e) => {
    Utils.clickEffect(e);
    await togglePlay(mpdHost, mpdPort);
    await getMpd();
  };

  const classes = Utils.classnames("mpd", { "mpd--playing": isPlaying });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      showSpecter={showSpecter && isPlaying}
    >
      {trackInfo}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Mpd";

async function togglePlay(host, port) {
  return Uebersicht.run(`mpc --host ${host} --port ${port} toggle`);
}
