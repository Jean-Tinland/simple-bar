import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { timeStyles as styles } from "../../styles/components/data/time";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 1000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, timeWidgetOptions } = settings;
  const { timeWidget } = widgets;
  const { refreshFrequency, hour12, dayProgress, showSeconds, showOnDisplay } =
    timeWidgetOptions;

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && timeWidget;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const options = React.useMemo(
    () => ({
      hour: "numeric",
      minute: "numeric",
      second: showSeconds ? "numeric" : undefined,
      hour12,
    }),
    [hour12, showSeconds]
  );

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getTime = React.useCallback(() => {
    if (!visible) return;
    const time = new Date().toLocaleString("en-UK", options);
    setState({ time });
    setLoading(false);
  }, [visible, options]);

  useServerSocket("time", visible, getTime, resetWidget);
  useWidgetRefresh(visible, getTime, refresh);

  if (loading) return <DataWidgetLoader.Widget className="time" />;
  if (!state) return null;
  const { time } = state;

  const [dayStart, dayEnd] = [new Date(), new Date()];
  dayStart.setHours(0, 0, 0);
  dayEnd.setHours(0, 0, 0);
  dayEnd.setDate(dayEnd.getDate() + 1);
  const range = dayEnd - dayStart;
  const diff = Math.max(0, dayEnd - new Date());
  const fillerWidth = (100 - (100 * diff) / range) / 100;

  const TimeIcon = () => {
    return <Icon time={time} />;
  };

  return (
    <DataWidget.Widget classes="time" Icon={TimeIcon} disableSlider>
      {time}
      {dayProgress && (
        <div
          className="time__filler"
          style={{ transform: `scaleX(${fillerWidth})` }}
        />
      )}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Time";

function Icon({ time }) {
  const [hours, minutes] = time.split(":");

  const hoursInDegree = ((parseInt(hours, 10) % 12) / 12) * 360;
  const minutesInDegree = (parseInt(minutes, 10) / 60) * 360;

  return (
    <div className="time__icon">
      <div
        className="time__hours"
        style={{ transform: `rotate(${hoursInDegree}deg)` }}
      />
      <div
        className="time__minutes"
        style={{ transform: `rotate(${minutesInDegree}deg)` }}
      />
    </div>
  );
}
