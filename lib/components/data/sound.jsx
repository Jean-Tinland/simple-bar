import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { soundStyles as styles } from "../../styles/components/data/sound";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 20000;

/**
 * Sound widget component.
 * @returns {JSX.Element|null} The sound widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, soundWidgetOptions } = settings;
  const { soundWidget } = widgets;
  const { refreshFrequency, showOnDisplay, showIcon } = soundWidgetOptions;

  // Determine the refresh frequency for the widget.
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  // Determine if the widget should be visible on the current display.
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && soundWidget;

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
   * Fetch the current sound settings.
   */
  const getSound = React.useCallback(async () => {
    if (!visible) return;
    const [volume, muted] = await Promise.all([
      Uebersicht.run(
        `osascript -e 'set ovol to output volume of (get volume settings)'`
      ),
      Uebersicht.run(
        `osascript -e 'set ovol to output muted of (get volume settings)'`
      ),
    ]);
    setState({
      volume: Utils.cleanupOutput(volume),
      muted: Utils.cleanupOutput(muted),
    });
    setLoading(false);
  }, [visible]);

  // Use server socket to listen for sound updates.
  useServerSocket("sound", visible, getSound, resetWidget, setLoading);
  // Refresh the widget at the specified interval.
  useWidgetRefresh(visible, getSound, refresh);

  // Update the sound settings when dragging ends.
  React.useEffect(() => {
    if (!dragging) setSound(volume);
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

  if (loading) return <DataWidgetLoader.Widget className="sound" />;
  if (!state || volume === undefined) return null;

  const { muted } = state;
  if (_volume === "missing value" || muted === "missing value") return null;

  let Icon = Icons.VolumeHigh;
  if (volume < 50) Icon = Icons.VolumeLow;
  if (volume < 20) Icon = Icons.NoVolume;
  if (muted === "true" || !volume) Icon = Icons.VolumeMuted;

  /**
   * Handle volume change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const onChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setVolume(value);
  };

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);

  const formattedVolume = `${volume.toString().padStart(2, "0")}%`;

  const classes = Utils.classNames("sound", {
    "sound--dragging": dragging,
  });

  return (
    <DataWidget.Widget classes={classes} disableSlider>
      <div className="sound__display">
        {showIcon && (
          <SuspenseIcon>
            <Icon />
          </SuspenseIcon>
        )}
        <span className="sound__value">{formattedVolume}</span>
      </div>
      <div className="sound__slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          className="sound__slider"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
      </div>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Sound";

/**
 * Set the system volume.
 * @param {number} volume - The volume to set.
 */
function setSound(volume) {
  if (volume === undefined) return;
  Uebersicht.run(`osascript -e 'set volume output volume ${volume}'`);
}
