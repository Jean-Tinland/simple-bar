import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { memoryStyles as styles } from "../../styles/components/data/memory";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 4000;

/**
 * Memory Widget component
 * @returns {JSX.Element|null} The memory widget component
 */
export const Widget = () => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, memoryWidgetOptions } = settings;
  const { memoryWidget } = widgets;
  const { refreshFrequency, showOnDisplay, memoryMonitorApp, showIcon } =
    memoryWidgetOptions;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && memoryWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  /**
   * Reset the widget state
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetch memory usage data
   */
  const getMemory = React.useCallback(async () => {
    const output = await Uebersicht.run(
      "memory_pressure | tail -1 | awk '{ print $5 }' | tr -d '%'",
    );
    const free = parseInt(Utils.cleanupOutput(output), 10);
    setState({ free });
    setLoading(false);
  }, [setLoading, setState]);

  // Use server socket to get memory data
  useServerSocket("memory", visible, getMemory, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getMemory, refresh);

  if (loading) return <DataWidgetLoader.Widget className="memory" />;
  if (!state) return null;

  const { free } = state;
  const used = 100 - free;

  // Handle click event to open memory usage app
  const onClick =
    memoryMonitorApp === "None"
      ? undefined
      : (e) => {
          Utils.clickEffect(e);
          openMemoryUsageApp(memoryMonitorApp);
        };

  /**
   * Pie chart component for memory usage
   * @returns {JSX.Element} The pie chart component
   */
  const Pie = () => {
    return (
      <div
        className="memory__pie"
        style={{
          backgroundImage: `conic-gradient(var(--pie-color) ${used}%, var(--main-alt) ${used}% 100%)`,
        }}
      />
    );
  };

  const classes = Utils.classNames("memory", {
    "memory--low": used <= 30,
    "memory--medium": used > 30 && used <= 70,
    "memory--high": used > 70,
  });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Pie : null}
      onClick={onClick}
    >
      <div className="memory__content">{used}%</div>
    </DataWidget.Widget>
  );
};

/**
 * Open the specified memory usage application
 * @param {string} app - The name of the application to open
 */
function openMemoryUsageApp(app) {
  switch (app) {
    case "Activity Monitor":
      Uebersicht.run(`open -a "Activity Monitor"`);
      break;
    case "Top":
      Utils.runInUserTerminal("top");
      break;
  }
}
