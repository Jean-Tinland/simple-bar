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

export const Widget = () => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, memoryWidgetOptions } = settings;
  const { memoryWidget } = widgets;
  const { refreshFrequency, showOnDisplay, memoryMonitorApp } =
    memoryWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && memoryWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getMemory = React.useCallback(async () => {
    const output = await Uebersicht.run(
      "memory_pressure | tail -1 | awk '{ print $5 }' | tr -d '%'"
    );
    const free = parseInt(Utils.cleanupOutput(output), 10);
    setState({ free });
    setLoading(false);
  }, [setLoading, setState]);

  useServerSocket("memory", visible, getMemory, resetWidget);
  useWidgetRefresh(visible, getMemory, refresh);

  if (loading) return <DataWidgetLoader.Widget className="memory" />;
  if (!state) return null;

  const { free } = state;
  const used = 100 - free;

  const onClick =
    memoryMonitorApp === "None"
      ? undefined
      : (e) => {
          Utils.clickEffect(e);
          openMemoryUsageApp(memoryMonitorApp);
        };

  const Pie = () => {
    return (
      <div
        className="memory__pie"
        style={{
          backgroundImage: `conic-gradient(var(--red) ${used}%, var(--green) ${used}% 100%)`,
        }}
      />
    );
  };

  const classes = Utils.classNames("memory", {
    "memory--high": used > 70,
  });

  return (
    <DataWidget.Widget classes={classes} Icon={Pie} onClick={onClick}>
      <div className="memory__content">{used}%</div>
    </DataWidget.Widget>
  );
};

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
