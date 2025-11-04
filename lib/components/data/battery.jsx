import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { batteryStyles as styles } from "../../styles/components/data/battery";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

/**
 * Battery widget component
 * @returns {JSX.Element|null} The battery widget component
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings, pushMissive } = useSimpleBarContext();
  const { widgets, batteryWidgetOptions } = settings;
  const { batteryWidget } = widgets;
  const {
    refreshFrequency,
    toggleCaffeinateOnClick,
    caffeinateOption,
    disableCaffeinateInvertedBackground,
    showOnDisplay,
    showIcon,
  } = batteryWidgetOptions;

  // Determine if the widget should be visible based on display settings
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && batteryWidget;

  // Calculate the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  // Reset the widget state
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetch battery information and update the state
   */
  const getBattery = React.useCallback(async () => {
    if (!visible) return;
    // Fetch battery information and parse the results
    const [system, percentage, status, caffeinate, lowPowerMode] =
      await Promise.all([
        Utils.getSystem(),
        Uebersicht.run(
          `pmset -g batt | egrep '([0-9]+%).*' -o --colour=auto | cut -f1 -d'%'`,
        ),
        Uebersicht.run(
          `pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19`,
        ),
        Uebersicht.run(`pgrep caffeinate`),
        Uebersicht.run(
          `pmset -g | grep -E 'lowpowermode|powermode' | awk '{print $2}'`,
        ),
      ]);
    setState({
      system,
      percentage: parseInt(percentage, 10),
      charging: Utils.cleanupOutput(status) === "AC",
      caffeinate: Utils.cleanupOutput(caffeinate),
      lowPowerMode: Utils.cleanupOutput(lowPowerMode) === "1",
    });
    setLoading(false);
  }, [visible]);

  // Use server socket to fetch battery data
  useServerSocket("battery", visible, getBattery, resetWidget, setLoading);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getBattery, refresh);

  if (loading) return <DataWidgetLoader.Widget className="battery" />;
  if (!state) return null;

  const { system, percentage, charging, caffeinate, lowPowerMode } = state;
  const isLowBattery = !charging && percentage < 20;

  const classes = Utils.classNames("battery", {
    "battery--low": isLowBattery,
    "battery--low-power-mode": lowPowerMode,
    "battery--caffeinate": !disableCaffeinateInvertedBackground && caffeinate.length,
  });

  const transformValue = getTransform(percentage);

  /**
   * Handle click event to toggle caffeinate mode
   * @param {React.MouseEvent} e - The click event
   */
  const onClick = async (e) => {
    Utils.clickEffect(e);
    await toggleCaffeinate(system, caffeinate, caffeinateOption, pushMissive);
    getBattery();
  };

  const onClickProp = toggleCaffeinateOnClick ? { onClick } : {};

  const Icon = () => (
    <div className="battery__icon">
      <div className="battery__icon-inner">
        <div
          className="battery__icon-filler"
          style={{ transform: transformValue }}
        />
        {charging && (
          <SuspenseIcon>
            <Icons.Charging className="battery__charging-icon" />
          </SuspenseIcon>
        )}
      </div>
    </div>
  );

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Icon : null}
      disableSlider
      {...onClickProp}
    >
      {caffeinate.length > 0 && (
        <SuspenseIcon>
          <Icons.Coffee className="battery__caffeinate-icon" />
        </SuspenseIcon>
      )}
      {percentage}%
    </DataWidget.Widget>
  );
});

Widget.displayName = "Battery";

/**
 * Get the transform value for the battery icon based on the percentage
 * @param {number} value - The battery percentage
 * @returns {string} The transform value
 */
function getTransform(value) {
  let transform = `0.${value}`;
  if (value === 100) transform = "1";
  if (value < 10) transform = `0.0${value}`;
  return `scaleX(${transform})`;
}

/**
 * Toggle caffeinate mode on or off
 * @param {string} system - The system architecture
 * @param {string} caffeinate - The current caffeinate state
 * @param {string} option - The caffeinate option
 * @param {function} pushMissive - Function to push notifications
 */
async function toggleCaffeinate(system, caffeinate, option, pushMissive) {
  const command =
    system === "x86_64" ? "caffeinate" : "arch -arch arm64 caffeinate";
  if (!caffeinate.length) {
    Uebersicht.run(`${command} ${option} &`);
    Utils.notification("Enabling caffeinate...", pushMissive);
  } else {
    await Uebersicht.run("pkill -f caffeinate");
    Utils.notification("Disabling caffeinate...", pushMissive);
  }
}
