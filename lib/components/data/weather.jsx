import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";

export { weatherStyles as styles } from "../../styles/components/data/weather";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 1000 * 60 * 30; // Default refresh frequency set to 30 minutes

/**
 * Weather widget component
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings, pushMissive } = useSimpleBarContext();
  const { widgets, weatherWidgetOptions } = settings;
  const { weatherWidget } = widgets;
  const {
    refreshFrequency,
    customLocation,
    unit,
    hideLocation,
    hideGradient,
    showOnDisplay,
    showIcon,
  } = weatherWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && weatherWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const location = React.useRef(
    visible && customLocation.length ? customLocation : undefined,
  );

  /**
   * Resets the widget state and loading status
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetches weather data from wttr.in
   */
  const getWeather = React.useCallback(async () => {
    if (!visible) return;
    if (!location.current) {
      const position = await Promise.race([getPosition(), Utils.timeout(5000)]);
      if (!position) await getWeather();
      const { city, zip } = position?.address || {};
      location.current = zip || city;
      if (!location.current) return setLoading(false);
    }
    try {
      const result = await fetch(
        `https://wttr.in/${location.current}?format=j1`,
      );
      const data = await result.json();
      setState({ location: location.current, data });
    } catch  {
      // eslint-disable-next-line no-console
      console.error("Error while fetching weather")
    }
    setLoading(false);
  }, [visible, location]);

  useServerSocket("weather", visible, getWeather, resetWidget, setLoading);
  useWidgetRefresh(visible, getWeather, refresh);

  if (loading) return <DataWidgetLoader.Widget className="weather" />;
  if (!state || !state.data.current_condition) return null;

  const {
    temp_C: tempC,
    temp_F: tempF,
    weatherDesc,
  } = state.data.current_condition[0];
  const temperature = unit === "C" ? tempC : tempF;
  const wttrUnitParam = unit === "C" ? "?m" : "?u";

  const description = weatherDesc[0].value;

  const { astronomy } = state.data.weather[0];
  const sunriseData = astronomy[0].sunrise.replace(" AM", "").split(":");
  const sunsetData = astronomy[0].sunset.replace(" PM", "").split(":");

  const now = new Date();
  const nowIntervalStart = new Date();
  nowIntervalStart.setHours(nowIntervalStart.getHours() - 1);
  const nowIntervalStop = new Date();
  nowIntervalStop.setHours(nowIntervalStop.getHours() + 1);
  const sunriseTime = new Date();
  sunriseTime.setHours(
    parseInt(sunriseData[0], 10),
    parseInt(sunriseData[1], 10),
    0,
    0,
  );
  const sunsetTime = new Date();
  sunsetTime.setHours(
    parseInt(sunsetData[0], 10) + 12,
    parseInt(sunsetData[1], 10),
    0,
    0,
  );

  const atNight = sunriseTime >= now || now >= sunsetTime;

  const Icon = getIcon(description, atNight);
  const label = getLabel(state.location, temperature, unit, hideLocation);

  const sunRising =
    sunriseTime >= nowIntervalStart && sunriseTime <= nowIntervalStop;
  const sunSetting =
    sunsetTime >= nowIntervalStart && sunsetTime <= nowIntervalStop;

  /**
   * Handles right-click event to refresh weather data
   * @param {Event} e - The event object
   */
  const onRightClick = (e) => {
    Utils.clickEffect(e);
    setLoading(true);
    getWeather();
    Utils.notification("Refreshing forecast from wttr.in...", pushMissive);
  };

  const classes = Utils.classNames("weather", {
    "weather--sunrise": sunRising,
    "weather--sunset": sunSetting,
  });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={showIcon ? Icon : null}
      href={`https://wttr.in/${state.location}${wttrUnitParam}`}
      onClick={(e) => openWeather(e, pushMissive)}
      onRightClick={onRightClick}
      disableSlider
    >
      {!hideGradient && <div className="weather__gradient" />}
      {label}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Weather";

/**
 * Returns the appropriate weather icon based on the description and time of day
 * @param {string} description - Weather description
 * @param {boolean} atNight - Whether it is currently night time
 * @returns {JSX.Element} - The weather icon component
 */
function getIcon(description, atNight) {
  if (description.includes("fog") || description.includes("mist")) {
    return Icons.Fog;
  }
  if (description.includes("storm")) return Icons.Storm;
  if (description.includes("snow")) return Icons.Snow;
  if (description.includes("rain")) return Icons.Rain;
  if (description.includes("cloud")) return Icons.Cloud;
  if (atNight) return Icons.Moon;
  return Icons.Sun;
}

/**
 * Returns the label for the weather widget
 * @param {string} location - The location name
 * @param {string} temperature - The temperature value
 * @param {string} unit - The temperature unit (C or F)
 * @param {boolean} hideLocation - Whether to hide the location name
 * @returns {string} - The label text
 */
function getLabel(location, temperature, unit, hideLocation) {
  if (!location) return "Fetching...";
  if (hideLocation) return `${temperature}°${unit}`;
  return `${location}, ${temperature}°${unit}`;
}

/**
 * Opens the weather forecast in a new tab
 * @param {Event} e - The event object
 * @param {Function} pushMissive - Function to push notifications
 */
function openWeather(e, pushMissive) {
  Utils.clickEffect(e);
  Utils.notification("Opening forecast from wttr.in...", pushMissive);
}

/**
 * Gets the current geographical position of the user
 * @returns {Promise<GeolocationPosition>} - The position object
 */
async function getPosition() {
  return new Promise((resolve) =>
    navigator.geolocation.getCurrentPosition(resolve),
  );
}
