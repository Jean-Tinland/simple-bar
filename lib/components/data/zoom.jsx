import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { zoomStyles as styles } from "../../styles/components/data/zoom";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 5000;

/**
 * Zoom widget component.
 * @returns {JSX.Element|null} The Zoom widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, zoomWidgetOptions } = settings;
  const { zoomWidget } = widgets;
  const { refreshFrequency, showVideo, showMic, showOnDisplay } =
    zoomWidgetOptions;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && zoomWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  /**
   * Reset the widget state.
   */
  const resetWidget = React.useCallback(() => {
    setState(undefined);
    setLoading(false);
  }, []);

  /**
   * Fetch the Zoom status for mic and video.
   */
  const getZoom = React.useCallback(async () => {
    if (!visible) return;
    try {
      const [mic, video] = await Promise.all([
        Uebersicht.run(
          `osascript ./simple-bar/lib/scripts/zoom-mute-status.applescript`,
        ),
        Uebersicht.run(
          `osascript ./simple-bar/lib/scripts/zoom-video-status.applescript`,
        ),
      ]);
      setState({
        mic: Utils.cleanupOutput(mic),
        video: Utils.cleanupOutput(video),
      });
      setLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching Zoom status:", error);
      setLoading(false);
    }
  }, [visible]);

  // Use server socket to listen for Zoom events
  useServerSocket("zoom", visible, getZoom, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getZoom, refresh);

  if (loading) return <DataWidgetLoader.Widget className="zoom" />;
  if (!state || (!state.mic.length && !state.video.length)) return null;

  const { mic, video } = state;

  const VideoIcon = video === "off" ? Icons.CameraOff : Icons.Camera;
  const MicIcon = mic === "off" ? Icons.MicOff : Icons.MicOn;

  return (
    <DataWidget.Widget classes="zoom">
      {showVideo && (
        <SuspenseIcon>
          <VideoIcon className={`zoom__icon zoom__icon--${video}`} />
        </SuspenseIcon>
      )}
      {showMic && (
        <SuspenseIcon>
          <MicIcon className={`zoom__icon zoom__icon--${mic}`} />
        </SuspenseIcon>
      )}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Zoom";
