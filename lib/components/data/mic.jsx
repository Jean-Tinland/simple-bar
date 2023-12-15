import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import * as Settings from "../../settings";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";

export { micStyles as styles } from "../../styles/components/data/mic";

const settings = Settings.get();
const { widgets, micWidgetOptions } = settings;
const { micWidget } = widgets;
const { refreshFrequency, showOnDisplay } = micWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 20000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

const setMic = (volume) => {
  if (volume === undefined) return;
  Uebersicht.run(`osascript -e 'set volume input volume ${volume}'`);
};

export const Widget = ({ display }) => {
  const visible = Utils.isVisibleOnDisplay(display, showOnDisplay) && micWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);
  const { volume: _volume } = state || {};
  const [volume, setVolume] = Uebersicht.React.useState(
    _volume && parseInt(_volume, 10)
  );
  const [dragging, setDragging] = Uebersicht.React.useState(false);

  const getMic = async () => {
    const volume = await Uebersicht.run(
      `osascript -e 'set ovol to input volume of (get volume settings)'`
    );
    setState({ volume: Utils.cleanupOutput(volume) });
    setLoading(false);
  };

  useWidgetRefresh(visible, getMic, REFRESH_FREQUENCY);

  Uebersicht.React.useEffect(() => {
    if (!dragging) setMic(volume);
  }, [dragging]);

  Uebersicht.React.useEffect(() => {
    if (_volume && parseInt(_volume, 10) !== volume) {
      setVolume(parseInt(_volume, 10));
    }
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

  const classes = Utils.classnames("mic", { "mic--dragging": dragging });

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
};
