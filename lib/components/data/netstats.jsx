import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh.js";
import * as Icons from "../icons.jsx";
import * as Utils from "../../utils.js";
import * as Settings from "../../settings.js";

export { netstatsStyles as styles } from "../../styles/components/data/netstats";

const settings = Settings.get();
const { widgets, netstatsWidgetOptions } = settings;
const { netstatsWidget } = widgets;
const { refreshFrequency, showOnDisplay } = netstatsWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 2000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

const formatBytes = (bytes, decimals = 1) => {
  if (!+bytes) return "0b";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["b", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}<em>${
    sizes[i]
  }</em>`;
};

export const Widget = ({ display }) => {
  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && netstatsWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const getNetstats = async () => {
    try {
      const output = await Uebersicht.run(
        `bash ./simple-bar/lib/scripts/netstats.sh 2>&1`
      );
      const data = Utils.cleanupOutput(output);
      const json = JSON.parse(data);
      setState(json);
      setLoading(false);
    } catch (e) {
      setTimeout(getNetstats, 1000);
    }
  };

  useWidgetRefresh(visible, getNetstats, REFRESH_FREQUENCY);

  if (loading)
    return (
      <Uebersicht.React.Fragment>
        <DataWidgetLoader.Widget className="netstats" />
        <DataWidgetLoader.Widget className="netstats" />
      </Uebersicht.React.Fragment>
    );

  if (!state?.download || !state?.upload) return null;

  const { download, upload } = state;

  return (
    <Uebersicht.React.Fragment>
      <DataWidget.Widget
        classes="netstats"
        tooltip="Network stats"
        disableSlider
      >
        <div className="netstats__item netstats__item--download">
          <Icons.Download className="netstats__icon" />
          <span
            className="netstats__value"
            dangerouslySetInnerHTML={{ __html: formatBytes(download) }}
          />
        </div>
      </DataWidget.Widget>
      <DataWidget.Widget
        classes="netstats"
        tooltip="Network stats"
        disableSlider
      >
        <div className="netstats__item netstats__item--upload">
          <Icons.Upload className="netstats__icon" />
          <span
            className="netstats__value"
            dangerouslySetInnerHTML={{ __html: formatBytes(upload) }}
          />
        </div>
      </DataWidget.Widget>
    </Uebersicht.React.Fragment>
  );
};
