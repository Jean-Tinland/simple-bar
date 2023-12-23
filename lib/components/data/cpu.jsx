import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import Graph from "./graph.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../context.jsx";
import * as Utils from "../../utils";

export { cpuStyles as styles } from "../../styles/components/data/cpu";

const DEFAULT_REFRESH_FREQUENCY = 2000;

const GRAPH_LENGTH = 50;

export const Widget = Uebersicht.React.memo(() => {
  const { display, settings } = useSimpleBarContext();
  const { widgets, cpuWidgetOptions } = settings;
  const { cpuWidget } = widgets;
  const { refreshFrequency, showOnDisplay, displayAsGraph } = cpuWidgetOptions;

  const visible = Utils.isVisibleOnDisplay(display, showOnDisplay) && cpuWidget;

  const refresh = Uebersicht.React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [graph, setGraph] = Uebersicht.React.useState([]);
  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getCpu = async () => {
    const usage = await Uebersicht.run(
      `top -l 1 | grep -E "^CPU" | grep -Eo '[^[:space:]]+%' | head -1 | sed s/%//`
    );
    const formatedUsage = { usage: parseInt(usage, 10).toFixed(0) };
    setState(formatedUsage);
    if (displayAsGraph) {
      Utils.addToGraphHistory(formatedUsage, setGraph, GRAPH_LENGTH);
    }
    setLoading(false);
  };

  useServerSocket("cpu", visible, getCpu, resetWidget);
  useWidgetRefresh(visible, getCpu, refresh);

  if (loading) return <DataWidgetLoader.Widget className="cpu" />;
  if (!state) return null;

  const { usage } = state;

  if (displayAsGraph) {
    return (
      <DataWidget.Widget classes="cpu cpu--graph" disableSlider>
        <Graph
          className="cpu__graph"
          caption={{
            usage: {
              value: `${usage}%`,
              icon: Icons.CPU,
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
    <DataWidget.Widget classes="cpu" Icon={Icons.CPU}>
      <span className="cpu__usage">{usage}%</span>
    </DataWidget.Widget>
  );
});
