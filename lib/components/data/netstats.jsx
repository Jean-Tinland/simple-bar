import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import Graph from "./graph.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh.js";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

export { netstatsStyles as styles } from "../../styles/components/data/netstats";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 2000;
const GRAPH_LENGTH = 30;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, netstatsWidgetOptions } = settings;
  const { netstatsWidget } = widgets;
  const { refreshFrequency, showOnDisplay, displayAsGraph } =
    netstatsWidgetOptions;

  const isDisabled = React.useRef(false);

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && netstatsWidget;

  const [graph, setGraph] = React.useState([]);
  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
    setGraph([]);
  };

  const getNetstats = React.useCallback(async () => {
    if (!visible) return;
    try {
      const output = await Uebersicht.run(
        `bash ./simple-bar/lib/scripts/netstats.sh 2>&1`
      );
      if (!visible || isDisabled.current) {
        return;
      }
      const data = Utils.cleanupOutput(output);
      const json = JSON.parse(data);
      setState(json);
      if (displayAsGraph) {
        Utils.addToGraphHistory(json, setGraph, GRAPH_LENGTH);
      }
      setLoading(false);
    } catch (e) {
      setTimeout(getNetstats, 1000);
    }
  }, [displayAsGraph, setGraph, visible]);

  React.useEffect(() => {
    isDisabled.current = !visible;
  }, [visible]);

  useServerSocket("netstats", visible, getNetstats, resetWidget);
  useWidgetRefresh(visible, getNetstats, refresh);

  if (loading)
    return (
      <React.Fragment>
        <DataWidgetLoader.Widget className="netstats" />
        {!displayAsGraph && <DataWidgetLoader.Widget className="netstats" />}
      </React.Fragment>
    );

  if (!state) {
    return null;
  }

  const { download, upload } = state;

  if (download === undefined || upload === undefined) {
    return null;
  }

  const formattedDownload = formatBytes(download);
  const formattedUpload = formatBytes(upload);

  if (displayAsGraph) {
    return (
      <DataWidget.Widget classes="netstats netstats--graph" disableSlider>
        <Graph
          className="netstats__graph"
          caption={{
            download: {
              value: formattedDownload,
              icon: Icons.Download,
              color: "var(--magenta)",
            },
            upload: {
              value: formattedUpload,
              icon: Icons.Upload,
              color: "var(--blue)",
            },
          }}
          values={graph}
          maxLength={GRAPH_LENGTH}
        />
      </DataWidget.Widget>
    );
  }

  return (
    <React.Fragment>
      <DataWidget.Widget classes="netstats" disableSlider>
        <div className="netstats__item">
          <SuspenseIcon>
            <Icons.Download className="netstats__icon netstats__icon--download" />
          </SuspenseIcon>
          <span
            className="netstats__value"
            dangerouslySetInnerHTML={{ __html: formattedDownload }}
          />
        </div>
      </DataWidget.Widget>
      <DataWidget.Widget classes="netstats" disableSlider>
        <div className="netstats__item">
          <SuspenseIcon>
            <Icons.Upload className="netstats__icon netstats__icon--upload" />
          </SuspenseIcon>
          <span
            className="netstats__value"
            dangerouslySetInnerHTML={{ __html: formattedUpload }}
          />
        </div>
      </DataWidget.Widget>
    </React.Fragment>
  );
});

Widget.displayName = "Netstats";

function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return "0b";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["b", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}<em>${
    sizes[i]
  }</em>`;
}
