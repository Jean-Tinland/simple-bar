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

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, soundWidgetOptions } = settings;
  const { soundWidget } = widgets;
  const { refreshFrequency, showOnDisplay } = soundWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && soundWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const { volume: _volume } = state || {};
  const [volume, setVolume] = React.useState(_volume && parseInt(_volume, 10));
  const [dragging, setDragging] = React.useState(false);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

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

  useServerSocket("sound", visible, getSound, resetWidget);
  useWidgetRefresh(visible, getSound, refresh);

  React.useEffect(() => {
    if (!dragging) setSound(volume);
  }, [dragging, volume]);

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

  const Icon = getIcon(volume, muted);

  const onChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setVolume(value);
  };
  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);

  const fillerWidth = volume || 0;
  const formattedVolume = `${volume.toString().padStart(2, "0")}%`;

  const classes = Utils.classNames("sound", {
    "sound--dragging": dragging,
  });

  return (
    <DataWidget.Widget classes={classes} disableSlider>
      <div className="sound__display">
        <SuspenseIcon>
          <Icon />
        </SuspenseIcon>
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
        <div
          className="sound__slider-filler"
          style={{ width: `${fillerWidth}%` }}
        />
      </div>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Sound";

function getIcon(volume, muted) {
  if (muted === "true" || !volume) return Icons.VolumeMuted;
  if (volume < 20) return Icons.NoVolume;
  if (volume < 50) return Icons.VolumeLow;
  return Icons.VolumeHigh;
}

function setSound(volume) {
  if (volume === undefined) return;
  Uebersicht.run(`osascript -e 'set volume output volume ${volume}'`);
}
