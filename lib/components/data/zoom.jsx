import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { zoomStyles as styles } from "../../styles/components/data/zoom";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 5000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, zoomWidgetOptions } = settings;
  const { zoomWidget } = widgets;
  const { refreshFrequency, showVideo, showMic, showOnDisplay } =
    zoomWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && zoomWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getZoom = React.useCallback(async () => {
    if (!visible) return;
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
  }, [visible]);

  useServerSocket("zoom", visible, getZoom, resetWidget);
  useWidgetRefresh(visible, getZoom, refresh);

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
});

Widget.displayName = "Zoom";
