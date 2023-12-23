import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../context.jsx";
import * as Utils from "../../utils";

export { batteryStyles as styles } from "../../styles/components/data/battery";

const DEFAULT_REFRESH_FREQUENCY = 10000;

export const Widget = Uebersicht.React.memo(() => {
  const { display, settings } = useSimpleBarContext();
  const { widgets, batteryWidgetOptions } = settings;
  const { batteryWidget } = widgets;
  const {
    refreshFrequency,
    toggleCaffeinateOnClick,
    caffeinateOption,
    showOnDisplay,
  } = batteryWidgetOptions;

  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && batteryWidget;

  const refresh = Uebersicht.React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getBattery = Uebersicht.React.useCallback(async () => {
    if (!visible) return;
    const [system, percentage, status, caffeinate] = await Promise.all([
      Utils.getSystem(),
      Uebersicht.run(
        `pmset -g batt | egrep '([0-9]+%).*' -o --colour=auto | cut -f1 -d'%'`
      ),
      Uebersicht.run(
        `pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19`
      ),
      Uebersicht.run(`pgrep caffeinate`),
    ]);
    setState({
      system,
      percentage: parseInt(percentage, 10),
      charging: Utils.cleanupOutput(status) === "AC",
      caffeinate: Utils.cleanupOutput(caffeinate),
    });
    setLoading(false);
  }, [visible]);

  useServerSocket("battery", visible, getBattery, resetWidget);
  useWidgetRefresh(visible, getBattery, refresh);

  if (loading) return <DataWidgetLoader.Widget className="battery" />;
  if (!state) return null;

  const { system, percentage, charging, caffeinate } = state;
  const isLowBattery = !charging && percentage < 20;

  const classes = Utils.classnames("battery", {
    "battery--low": isLowBattery,
    "battery--caffeinate": caffeinate.length,
  });

  const transformValue = getTransform(percentage);

  const onClick = async (e) => {
    Utils.clickEffect(e);
    await toggleCaffeinate(system, caffeinate, caffeinateOption);
    getBattery();
  };

  const onClickProp = toggleCaffeinateOnClick ? { onClick } : {};

  const Icon = () => (
    <div className="battery__icon">
      <div className="battery__icon-inner">
        {charging && <Icons.Charging className="battery__charging-icon" />}
        <div
          className="battery__icon-filler"
          style={{ transform: transformValue }}
        />
      </div>
    </div>
  );

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      disableSlider
      {...onClickProp}
    >
      {caffeinate.length > 0 && (
        <Icons.Coffee className="battery__caffeinate-icon" />
      )}
      {percentage}%
    </DataWidget.Widget>
  );
});

Widget.displayName = "Battery";

function getTransform(value) {
  let transform = `0.${value}`;
  if (value === 100) transform = "1";
  if (value < 10) transform = `0.0${value}`;
  return `scaleX(${transform})`;
}

async function toggleCaffeinate(system, caffeinate, option) {
  const command =
    system === "x86_64" ? "caffeinate" : "arch -arch arm64 caffeinate";
  if (!caffeinate.length) {
    Uebersicht.run(`${command} ${option} &`);
    Utils.notification("Enabling caffeinate...");
  } else {
    await Uebersicht.run("pkill -f caffeinate");
    Utils.notification("Disabling caffeinate...");
  }
}
