import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import * as Utils from "../../utils";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

const { React } = Uebersicht;

export { micStyles as styles } from "../../styles/components/data/mic";

const DEFAULT_REFRESH_FREQUENCY = 20000;

/**
 * Mic widget component.
 * @returns {JSX.Element} The rendered mic widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, micWidgetOptions } = settings;
  const { micWidget } = widgets;
  const { refreshFrequency, showOnDisplay, showIcon } = micWidgetOptions;

  // Determine the refresh frequency for the widget.
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible.
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && micWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const { volume: _volume } = state || {};
  const [volume, setVolume] = React.useState(_volume && parseInt(_volume, 10));
  const [dragging, setDragging] = React.useState(false);

  /**
   * Reset the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetch the current microphone volume.
   */
  const getMic = React.useCallback(async () => {
    if (!visible) return;
    const volume = await Uebersicht.run(
      `osascript -e 'set ovol to input volume of (get volume settings)'`,
    );
    setState({ volume: Utils.cleanupOutput(volume) });
    setLoading(false);
  }, [visible]);

  // Use server socket to get mic data.
  useServerSocket("mic", visible, getMic, resetWidget, setLoading);
  // Refresh the widget periodically.
  useWidgetRefresh(visible, getMic, refresh);

  // Update the mic volume when dragging state changes.
  React.useEffect(() => {
    if (!dragging) setMic(volume);
  }, [dragging, volume]);

  // Update the volume state when the fetched volume changes.
  React.useEffect(() => {
    setVolume((currentVolume) => {
      if (_volume && currentVolume !== parseInt(_volume, 10)) {
        return parseInt(_volume, 10);
      }
      return currentVolume;
    });
  }, [_volume]);

  if (loading) return <DataWidgetLoader.Widget className="mic" />;
  if (!state || volume === undefined || _volume === "missing value")
    return null;

  const Icon = !volume ? Icons.MicOff : Icons.MicOn;

  /**
   * Handle volume change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const onChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setVolume(value);
  };

  /**
   * Handle mouse down event on the slider.
   */
  const onMouseDown = () => setDragging(true);

  /**
   * Handle mouse up event on the slider.
   */
  const onMouseUp = () => setDragging(false);

  const formattedVolume = `${volume.toString().padStart(2, "0")}%`;

  const classes = Utils.classNames("mic", {
    "mic--dragging": dragging,
  });

  return (
    <DataWidget.Widget classes={classes} disableSlider>
      <div className="mic__display">
        {showIcon && (
          <SuspenseIcon>
            <Icon />
          </SuspenseIcon>
        )}
        <span className="mic__value">{formattedVolume}</span>
      </div>
      <div className="mic__slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          className="mic__slider"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
      </div>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Mic";

/**
 * Set the microphone volume.
 * @param {number} volume - The volume level to set.
 */
function setMic(volume) {
  if (volume === undefined) return;
  Uebersicht.run(`osascript -e 'set volume input volume ${volume}'`);
}
