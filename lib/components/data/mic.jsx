import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import * as Utils from "../../utils";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

const { React } = Uebersicht;

export { micStyles as styles } from "../../styles/components/data/mic";

const DEFAULT_REFRESH_FREQUENCY = 20000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, micWidgetOptions } = settings;
  const { micWidget } = widgets;
  const { refreshFrequency, showOnDisplay } = micWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && micWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const { volume: _volume } = state || {};
  const [volume, setVolume] = React.useState(_volume && parseInt(_volume, 10));
  const [dragging, setDragging] = React.useState(false);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getMic = React.useCallback(async () => {
    if (!visible) return;
    const volume = await Uebersicht.run(
      `osascript -e 'set ovol to input volume of (get volume settings)'`
    );
    setState({ volume: Utils.cleanupOutput(volume) });
    setLoading(false);
  }, [visible]);

  useServerSocket("mic", visible, getMic, resetWidget);
  useWidgetRefresh(visible, getMic, refresh);

  React.useEffect(() => {
    if (!dragging) setMic(volume);
  }, [dragging, volume]);

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

  const onChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setVolume(value);
  };
  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);

  const fillerWidth = !volume ? volume : volume / 100 + 0.05;

  const classes = Utils.classNames("mic", {
    "mic--dragging": dragging,
  });

  return (
    <DataWidget.Widget classes={classes} disableSlider>
      <div className="mic__display">
        <Icon />
        <span className="mic__value">{volume}%</span>
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
        <div
          className="mic__slider-filler"
          style={{ transform: `scaleX(${fillerWidth})` }}
        />
      </div>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Mic";

function setMic(volume) {
  if (volume === undefined) return;
  Uebersicht.run(`osascript -e 'set volume input volume ${volume}'`);
}
