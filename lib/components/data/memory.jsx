import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import * as Utils from "../../utils";
import * as Settings from "../../settings";

export { memoryStyles as styles } from "../../styles/components/data/memory";

const settings = Settings.get();
const { widgets, memoryWidgetOptions } = settings;
const { memoryWidget } = widgets;
const { refreshFrequency, showOnDisplay } = memoryWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 5000;
const REFRESH_FREQUENCY = Utils.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

export const Widget = ({ display }) => {
  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && memoryWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const getMemory = async () => {
    const output = await Uebersicht.run(
      `bash ./simple-bar/lib/scripts/memory.sh 2>&1`
    );
    const data = Utils.cleanupOutput(output);
    const json = JSON.parse(data);
    setState(json);
    setLoading(false);
  };

  useWidgetRefresh(visible, getMemory, REFRESH_FREQUENCY);

  if (loading) return <DataWidgetLoader.Widget className="memory" />;
  if (!state) return null;

  const { used, total, system } = state;
  const free = total - used;

  const relativeSystem = (system / total) * 100;
  const relativeUsed = (used / total) * 100;
  const relativeFree = (free / total) * 100;

  const Pie = () => {
    return (
      <div
        className="memory__pie"
        style={{
          backgroundImage: `conic-gradient(var(--green) ${relativeSystem}%, var(--red) ${relativeSystem}% ${relativeUsed}%, var(--yellow) ${relativeUsed}% ${relativeFree}%)`,
        }}
      />
    );
  };

  return <DataWidget.Widget classes="memory" Icon={Pie} />;
};
