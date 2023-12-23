import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import Graph from "./graph.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import * as Utils from "../../utils";
import * as Settings from "../../settings";

export { cpuStyles as styles } from "../../styles/components/data/cpu";

const settings = Settings.get();
const { widgets, cpuWidgetOptions } = settings;
const { cpuWidget } = widgets;
const { refreshFrequency, showOnDisplay, displayAsGraph } = cpuWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 2000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

const GRAPH_LENGTH = 50;

export const Widget = ({ display }) => {
  const visible = Utils.isVisibleOnDisplay(display, showOnDisplay) && cpuWidget;

  const [graph, setGraph] = Uebersicht.React.useState([]);
  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

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

  useWidgetRefresh(visible, getCpu, REFRESH_FREQUENCY);

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
};
