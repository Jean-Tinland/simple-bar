import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { dateStyles as styles } from "../../styles/components/data/date-display";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 30000;

/**
 * Date display widget component.
 * @returns {JSX.Element} The date display widget.
 */
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
    showIcon,
  } = dateWidgetOptions;

  // Determine if the widget should be visible based on display settings
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && dateWidget;

  // Calculate the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const formatOptions = shortDateFormat ? "short" : "long";

  // Memoize the date format options
  const options = React.useMemo(
    () => ({
      weekday: formatOptions,
      month: formatOptions,
      day: "numeric",
    }),
    [formatOptions],
  );

  // Ensure locale is valid, default to "en-UK" if not
  const _locale = locale.length > 4 ? locale : "en-UK";

  /**
   * Reset the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Get the current date and update the state.
   */
  const getDate = React.useCallback(() => {
    if (!visible) return;
    const now = new Date().toLocaleDateString(_locale, options);
    setState({ now });
    setLoading(false);
  }, [_locale, options, visible]);

  // Use server socket to get date updates
  useServerSocket("date-display", visible, getDate, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getDate, refresh);

  if (loading) return <DataWidgetLoader.Widget className="date-display" />;
  if (!state) return null;
  const { now } = state;

  /**
   * Handle click event to open the calendar application.
   * @param {Event} e - The click event.
   */
  const onClick = (e) => {
    Utils.clickEffect(e);
    openCalendarApp(calendarApp);
  };

  return (
    <DataWidget.Widget
      classes="date-display"
      Icon={showIcon ? Icons.Date : null}
      onClick={onClick}
    >
      {now}
    </DataWidget.Widget>
  );
});

Widget.displayName = "DateDisplay";

/**
 * Open the specified calendar application.
 * @param {string} calendarApp - The name of the calendar application to open.
 */
function openCalendarApp(calendarApp) {
  const appName = calendarApp || "Calendar";
  Uebersicht.run(`open -a "${appName}"`);
}
