import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { dateStyles as styles } from "../../styles/components/data/date-display";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 30000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
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
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && dateWidget;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const formatOptions = shortDateFormat ? "short" : "long";

  const options = React.useMemo(
    () => ({
      weekday: formatOptions,
      month: formatOptions,
      day: "numeric",
    }),
    [formatOptions]
  );
  const _locale = locale.length > 4 ? locale : "en-UK";

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getDate = React.useCallback(() => {
    if (!visible) return;
    const now = new Date().toLocaleDateString(_locale, options);
    setState({ now });
    setLoading(false);
  }, [_locale, options, visible]);

  useServerSocket("date-display", visible, getDate, resetWidget);
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

Widget.displayName = "DateDisplay";

function openCalendarApp(calendarApp) {
  const appName = calendarApp || "Calendar";
  Uebersicht.run(`open -a "${appName}"`);
}
