import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import * as Settings from "../../settings";
import * as Utils from "../../utils";

export { zoomStyles as styles } from "../../styles/components/data/zoom";

const settings = Settings.get();
const { widgets, zoomWidgetOptions } = settings;
const { zoomWidget } = widgets;
const { refreshFrequency, showVideo, showMic, showOnDisplay } =
  zoomWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 5000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

export const Widget = ({ display }) => {
  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && zoomWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const getZoom = async () => {
    const [mic, video] = await Promise.all([
      Uebersicht.run(
        `osascript ./simple-bar/lib/scripts/zoom-mute-status.applescript`
      ),
      Uebersicht.run(
        `osascript ./simple-bar/lib/scripts/zoom-video-status.applescript`
      ),
    ]);
    setState({
      mic: Utils.cleanupOutput(mic),
      video: Utils.cleanupOutput(video),
    });
    setLoading(false);
  };

  useWidgetRefresh(visible, getZoom, REFRESH_FREQUENCY);

  if (loading) return <DataWidgetLoader.Widget className="zoom" />;
  if (!state || (!state.mic.length && !state.video.length)) return null;

  const { mic, video } = state;
  const VideoIcon = video === "off" ? Icons.CameraOff : Icons.Camera;
  const MicIcon = mic === "off" ? Icons.MicOff : Icons.MicOn;
  return (
    <DataWidget.Widget classes="zoom">
      {showVideo && <VideoIcon className={`zoom__icon zoom__icon--${video}`} />}
      {showMic && <MicIcon className={`zoom__icon zoom__icon--${mic}`} />}
    </DataWidget.Widget>
  );
};
