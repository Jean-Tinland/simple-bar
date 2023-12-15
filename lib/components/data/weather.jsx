import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import * as Utils from "../../utils";
import * as Settings from "../../settings";
import useWidgetRefresh from "../../hooks/use-widget-refresh";

export { weatherStyles as styles } from "../../styles/components/data/weather";

const settings = Settings.get();
const { widgets, weatherWidgetOptions } = settings;
const { weatherWidget } = widgets;
const {
  refreshFrequency,
  customLocation,
  unit,
  hideLocation,
  hideGradient,
  showOnDisplay,
} = weatherWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 1000 * 60 * 30;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

const getIcon = (description, atNight) => {
  if (description.includes("fog") || description.includes("mist"))
    return Icons.Fog;
  if (description.includes("storm")) return Icons.Storm;
  if (description.includes("snow")) return Icons.Snow;
  if (description.includes("rain")) return Icons.Rain;
  if (description.includes("cloud")) return Icons.Cloud;
  if (atNight) return Icons.Moon;
  return Icons.Sun;
};

const getLabel = (location, temperature, unit, hideLocation) => {
  if (!location) return "Fetching...";
  if (hideLocation) return `${temperature}°${unit}`;
  return `${location}, ${temperature}°${unit}`;
};

const openWeather = (e) => {
  Utils.clickEffect(e);
  Utils.notification("Opening forecast from wttr.in...");
};

const getPosition = async () =>
  new Promise((resolve) => navigator.geolocation.getCurrentPosition(resolve));

export const Widget = ({ display }) => {
  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && weatherWidget;

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);
  let location = visible && customLocation.length ? customLocation : undefined;

  const getWeather = async () => {
    if (!location) {
      const position = await Promise.race([getPosition(), Utils.timeout(5000)]);
      if (!position) await getWeather();
      location = position?.address?.city;
      if (!location) return setLoading(false);
    }
    try {
      const result = await fetch(`https://wttr.in/${location}?format=j1`);
      const data = await result.json();
      setState({ location, data });
    } catch (e) {
      //
    }
    setLoading(false);
  };

  useWidgetRefresh(visible, getWeather, REFRESH_FREQUENCY);

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
    0
  );
  const sunsetTime = new Date();
  sunsetTime.setHours(
    parseInt(sunsetData[0], 10) + 12,
    parseInt(sunsetData[1], 10),
    0,
    0
  );

  const atNight = sunriseTime >= now || now >= sunsetTime;

  const Icon = getIcon(description, atNight);
  const label = getLabel(state.location, temperature, unit, hideLocation);

  const sunrising =
    sunriseTime >= nowIntervalStart && sunriseTime <= nowIntervalStop;
  const sunsetting =
    sunsetTime >= nowIntervalStart && sunsetTime <= nowIntervalStop;

  const onRightClick = (e) => {
    Utils.clickEffect(e);
    setLoading(true);
    getWeather();
    Utils.notification("Refreshing forecast from wttr.in...");
  };

  const classes = Utils.classnames("weather", {
    "weather--sunrise": sunrising,
    "weather--sunset": sunsetting,
  });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      href={`https://wttr.in/${state.location}${wttrUnitParam}`}
      onClick={openWeather}
      onRightClick={onRightClick}
      disableSlider
    >
      {!hideGradient && <div className="weather__gradient" />}
      {label}
    </DataWidget.Widget>
  );
};
