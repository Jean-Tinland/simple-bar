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

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, gpuWidgetOptions } = settings;
  const { gpuWidget } = widgets;
  const {
    refreshFrequency,
    showOnDisplay,
    displayAsGraph,
    gpuMacmonBinaryPath,
  } = gpuWidgetOptions;

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && gpuWidget;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [graph, setGraph] = React.useState([]);
  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
    setGraph([]);
  };

  const getGpu = React.useCallback(async () => {
    if (!visible) return;
    try {
      const result = await Uebersicht.run(`${gpuMacmonBinaryPath} pipe -s 1`);
      const json = JSON.parse(result);
      const { gpu_usage } = json;
      const formattedUsage = { usage: Math.round(gpu_usage[1] * 100) };
      setState(formattedUsage);
      if (displayAsGraph) {
        Utils.addToGraphHistory(formattedUsage, setGraph, GRAPH_LENGTH);
      }
      setLoading(false);
    } catch (e) {
      setTimeout(getGpu, 1000);
    }
  }, [displayAsGraph, gpuMacmonBinaryPath, visible]);

  useServerSocket("gpu", visible, getGpu, resetWidget);
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
              icon: Icons.CPU,
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
    <DataWidget.Widget classes="cpu" Icon={Icons.CPU}>
      <span className="cpu__usage">{usage}%</span>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Gpu";
