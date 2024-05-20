import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import Graph from "./graph.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { cpuStyles as styles } from "../../styles/components/data/cpu";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 2000;
const GRAPH_LENGTH = 50;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, cpuWidgetOptions } = settings;
  const { cpuWidget } = widgets;
  const { refreshFrequency, showOnDisplay, displayAsGraph, cpuMonitorApp } =
    cpuWidgetOptions;

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && cpuWidget;

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

  const getCpu = React.useCallback(async () => {
    if (!visible) return;
    try {
      const usage = await Uebersicht.run(
        `top -l 1 | grep -E "^CPU" | grep -Eo '[^[:space:]]+%' | head -1 | sed s/%//`
      );
      const formatedUsage = { usage: parseInt(usage, 10).toFixed(0) };
      setState(formatedUsage);
      if (displayAsGraph) {
        Utils.addToGraphHistory(formatedUsage, setGraph, GRAPH_LENGTH);
      }
      setLoading(false);
    } catch (e) {
      setTimeout(getCpu, 1000);
    }
  }, [displayAsGraph, setGraph, visible]);

  useServerSocket("cpu", visible, getCpu, resetWidget);
  useWidgetRefresh(visible, getCpu, refresh);

  if (loading) return <DataWidgetLoader.Widget className="cpu" />;
  if (!state) return null;

  const { usage } = state;

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
    <DataWidget.Widget classes="cpu" Icon={Icons.CPU} onClick={onClick}>
      <span className="cpu__usage">{usage}%</span>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Cpu";

function openCpuUsageApp(cpuUsageApp) {
  switch (cpuUsageApp) {
    case "Activity Monitor":
      Uebersicht.run(`open -a "Activity Monitor"`);
      break;
    case "Top":
      Utils.runInUserTerminal("top");
      break;
  }
}
