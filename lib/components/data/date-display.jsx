import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../context.jsx";

export { dateStyles as styles } from "../../styles/components/data/date-display";

const DEFAULT_REFRESH_FREQUENCY = 30000;

const openCalendarApp = (calendarApp) => {
  const appName = calendarApp || "Calendar";
  Uebersicht.run(`open -a "${appName}"`);
};

export const Widget = Uebersicht.React.memo(() => {
  const { display, settings } = useSimpleBarContext();
  const { widgets, dateWidgetOptions } = settings;
  const { dateWidget } = widgets;
  const {
    refreshFrequency,
    shortDateFormat,
    locale,
    calendarApp,
    showOnDisplay,
  } = dateWidgetOptions;

  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && dateWidget;

  const refresh = Uebersicht.React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const formatOptions = shortDateFormat ? "short" : "long";

  const options = {
    weekday: formatOptions,
    month: formatOptions,
    day: "numeric",
  };
  const _locale = locale.length > 4 ? locale : "en-UK";

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getDate = () => {
    const now = new Date().toLocaleDateString(_locale, options);
    setState({ now });
    setLoading(false);
  };

  useServerSocket("date-display", getDate, resetWidget);
  useWidgetRefresh(visible, getDate, refresh);

  if (loading) return <DataWidgetLoader.Widget className="date-display" />;
  if (!state) return null;
  const { now } = state;

  const onClick = (e) => {
    Utils.clickEffect(e);
    openCalendarApp(calendarApp);
  };

  return (
    <DataWidget.Widget
      classes="date-display"
      Icon={Icons.Date}
      onClick={onClick}
    >
      {now}
    </DataWidget.Widget>
  );
});
