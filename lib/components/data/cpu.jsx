import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import Graph from "./graph.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { cpuStyles as styles } from "../../styles/components/data/cpu";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 2000;
const GRAPH_LENGTH = 50;

/**
 * CPU Widget component
 * @returns {JSX.Element|null} The CPU widget
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, cpuWidgetOptions } = settings;
  const { cpuWidget } = widgets;
  const {
    refreshFrequency,
    showOnDisplay,
    displayAsGraph,
    cpuMonitorApp,
    showIcon,
  } = cpuWidgetOptions;

  // Determine if the widget should be visible based on display settings
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && cpuWidget;

  // Set the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [graph, setGraph] = React.useState([]);
  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  /**
   * Reset the widget state
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
    setGraph([]);
  };

  /**
   * Fetch CPU usage data
   */
  const getCpu = React.useCallback(async () => {
    if (!visible) return;
    try {
      const usage = await Uebersicht.run(
        `top -l 1 | grep -E "^CPU" | grep -Eo '[^[:space:]]+%' | head -1 | sed s/%//`
      );
      const formattedUsage = { usage: parseInt(usage, 10).toFixed(0) };
      setState(formattedUsage);
      if (displayAsGraph) {
        Utils.addToGraphHistory(formattedUsage, setGraph, GRAPH_LENGTH);
      }
      setLoading(false);
    } catch {
      setTimeout(getCpu, 1000);
    }
  }, [displayAsGraph, setGraph, visible]);

  // Use server socket to fetch CPU data
  useServerSocket("cpu", visible, getCpu, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getCpu, refresh);

  if (loading) return <DataWidgetLoader.Widget className="cpu" />;
  if (!state) return null;

  const { usage } = state;

  // Handle click event to open CPU monitor app
  const onClick =
    cpuMonitorApp === "None"
      ? undefined
      : (e) => {
          Utils.clickEffect(e);
          openCpuUsageApp(cpuMonitorApp);
        };

  if (displayAsGraph) {
    return (
      <DataWidget.Widget
        classes="cpu cpu--graph"
        onClick={onClick}
        disableSlider
      >
        <Graph
          className="cpu__graph"
          caption={{
            usage: {
              value: `${usage}%`,
              icon: showIcon ? Icons.CPU : null,
              color: "var(--yellow)",
            },
          }}
          values={graph}
          maxLength={GRAPH_LENGTH}
          maxValue={100}
        />
      </DataWidget.Widget>
    );
  }

  return (
    <DataWidget.Widget
      classes="cpu"
      Icon={showIcon ? Icons.CPU : null}
      onClick={onClick}
    >
      <span className="cpu__usage">{usage}%</span>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Cpu";

/**
 * Open the specified CPU usage monitoring application
 * @param {string} app - The name of the application to open
 */
function openCpuUsageApp(app) {
  switch (app) {
    case "Activity Monitor":
      Uebersicht.run(`open -a "Activity Monitor"`);
      break;
    case "Top":
      Utils.runInUserTerminal("top");
      break;
  }
}
