import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import * as Settings from "../../settings";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";

export { mpdStyles as styles } from "../../styles/components/data/mpd";

const settings = Settings.get();
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

const DEFAULT_REFRESH_FREQUENCY = 10000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

const togglePlay = (host, port) =>
  Uebersicht.run(`mpc --host ${host} --port ${port} toggle`);

export const Widget = ({ display }) => {
  const visible = Utils.isVisibleOnDisplay(display, showOnDisplay) && mpdWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const getMpd = async () => {
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
  };

  useWidgetRefresh(visible, getMpd, REFRESH_FREQUENCY);

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
};
