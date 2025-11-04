import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import Graph from "./graph.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh.js";
import useServerSocket from "../../hooks/use-server-socket.js";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

export { gpuStyles as styles } from "../../styles/components/data/gpu.js";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 2000;
const GRAPH_LENGTH = 40;

/**
 * GPU Widget component
 * @returns {JSX.Element|null} The GPU widget component
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, gpuWidgetOptions } = settings;
  const { gpuWidget } = widgets;
  const {
    refreshFrequency,
    showOnDisplay,
    displayAsGraph,
    gpuMacmonBinaryPath,
    showIcon,
  } = gpuWidgetOptions;

  const isDisabled = React.useRef(false);

  // Calculate the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  // Determine if the widget should be visible
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && gpuWidget;

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
   * Fetch GPU data and update the widget state
   */
  const getGpu = React.useCallback(async () => {
    if (!visible) return;
    try {
      const result = await Uebersicht.run(`${gpuMacmonBinaryPath} pipe -s 1`);
      if (!visible || isDisabled.current) {
        return;
      }
      const json = JSON.parse(result);
      const { gpu_usage } = json;
      const formattedUsage = { usage: Math.round(gpu_usage[1] * 100) };
      setState(formattedUsage);
      if (displayAsGraph) {
        Utils.addToGraphHistory(formattedUsage, setGraph, GRAPH_LENGTH);
      }
      setLoading(false);
    } catch {
      setTimeout(getGpu, 1000);
    }
  }, [displayAsGraph, gpuMacmonBinaryPath, visible]);

  // Update the disabled state based on visibility
  React.useEffect(() => {
    isDisabled.current = !visible;
  }, [visible]);

  // Use server socket to fetch GPU data
  useServerSocket("gpu", visible, getGpu, resetWidget, setLoading);
  // Use widget refresh hook to periodically refresh the widget
  useWidgetRefresh(visible, getGpu, refresh);

  if (loading) return <DataWidgetLoader.Widget className="cpu" />;
  if (!state) return null;

  const { usage } = state;

  if (displayAsGraph) {
    return (
      <DataWidget.Widget classes="gpu gpu--graph" disableSlider>
        <Graph
          className="gpu__graph"
          caption={{
            usage: {
              value: `${usage}%`,
              icon: showIcon ? Icons.CPU : null,
              color: "var(--cyan)",
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
    <DataWidget.Widget classes="cpu" Icon={showIcon ? Icons.CPU : null}>
      <span className="cpu__usage">{usage}%</span>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Gpu";
