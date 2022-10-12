import UserWidgets from "./lib/components/data/user-widgets.jsx";
import * as Error from "./lib/components/error.jsx";
import * as Spaces from "./lib/components/spaces/spaces.jsx";
import * as Process from "./lib/components/spaces/process.jsx";
import * as Variables from "./lib/styles/core/variables";
import * as Base from "./lib/styles/core/base";
import * as Zoom from "./lib/components/data/zoom.jsx";
import * as Time from "./lib/components/data/time.jsx";
import * as DateDisplay from "./lib/components/data/date-display.jsx";
import * as Weather from "./lib/components/data/weather.jsx";
import * as Battery from "./lib/components/data/battery.jsx";
import * as Sound from "./lib/components/data/sound.jsx";
import * as Mic from "./lib/components/data/mic.jsx";
import * as Wifi from "./lib/components/data/wifi.jsx";
import * as ViscosityVPN from "./lib/components/data/viscosity-vpn.jsx";
import * as Keyboard from "./lib/components/data/keyboard.jsx";
import * as Spotify from "./lib/components/data/spotify.jsx";
import * as Crypto from "./lib/components/data/crypto.jsx";
import * as Stock from "./lib/components/data/stock.jsx";
import * as Music from "./lib/components/data/music.jsx";
import * as Mpd from "./lib/components/data/mpd.jsx";
import * as BrowserTrack from "./lib/components/data/browser-track.jsx";
import * as Dnd from "./lib/components/data/dnd.jsx";
import * as Specter from "./lib/components/data/specter.jsx";
import * as DataWidgetLoader from "./lib/components/data/data-widget-loader.jsx";
import * as DataWidget from "./lib/components/data/data-widget.jsx";
import * as Utils from "./lib/utils";
import * as Settings from "./lib/settings";

const refreshFrequency = false;

const settings = Settings.get();
const { yabaiPath = "/usr/local/bin/yabai", shell } = settings.global;
const { processWidget } = settings.widgets;

const command = `${shell} simple-bar/lib/scripts/init.sh ${yabaiPath}`;

Utils.injectStyles("simple-bar-index-styles", [
  Variables.styles,
  Base.styles,
  Spaces.styles,
  Process.styles,
  Settings.styles,
  settings.customStyles.styles,
  DataWidget.styles,
  DateDisplay.styles,
  Zoom.styles,
  Time.styles,
  Weather.styles,
  Crypto.styles,
  Stock.styles,
  Battery.styles,
  Wifi.styles,
  ViscosityVPN.styles,
  Keyboard.styles,
  Mic.styles,
  Sound.styles,
  Spotify.styles,
  Music.styles,
  Mpd.styles,
  BrowserTrack.styles,
  Dnd.styles,
  Specter.styles,
  DataWidgetLoader.styles,
]);

const render = ({ output, error }) => {
  const baseClasses = Utils.classnames("simple-bar", {
    "simple-bar--floating": settings.global.floatingBar,
    "simple-bar--no-bar-background": settings.global.noBarBg,
    "simple-bar--on-bottom": settings.global.bottomBar,
    "simple-bar--inline-spaces-options": settings.global.inlineSpacesOptions,
    "simple-bar--spaces-background-color-as-foreground":
      settings.global.spacesBackgroundColorAsForeground,
    "simple-bar--widgets-background-color-as-foreground":
      settings.global.widgetsBackgroundColorAsForeground,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error in spaces.jsx", error);
    return <Error.Component type="error" classes={baseClasses} />;
  }
  if (!output) return <Error.Component type="noOutput" classes={baseClasses} />;
  if (Utils.cleanupOutput(output) === "yabaiError") {
    return <Error.Component type="yabaiError" classes={baseClasses} />;
  }

  const data = Utils.parseJson(output);
  if (!data) return <Error.Component type="noData" classes={baseClasses} />;

  const { displays, shadow, SIP, spaces, windows } = data;

  const displayId = parseInt(window.location.pathname.replace("/", ""));
  const { index: displayIndex } = displays.find((d) => {
    return d.id === displayId;
  });

  const classes = Utils.classnames(baseClasses, {
    "simple-bar--no-shadow": shadow !== "on",
  });

  Utils.handleBarFocus();

  return (
    <div className={classes}>
      <Spaces.Component
        spaces={spaces}
        windows={windows}
        SIP={SIP}
        displayIndex={displayIndex}
      />
      {processWidget && (
        <Process.Component
          displayIndex={displayIndex}
          spaces={spaces}
          windows={windows}
        />
      )}
      <div className="simple-bar__data">
        <Settings.Wrapper />
        <UserWidgets />
        <Zoom.Widget />
        <BrowserTrack.Widget />
        <Spotify.Widget />
        <Crypto.Widget />
        <Stock.Widget />
        <Music.Widget />
        <Mpd.Widget />
        <Weather.Widget />
        <Battery.Widget />
        <Mic.Widget />
        <Sound.Widget />
        <ViscosityVPN.Widget />
        <Wifi.Widget />
        <Keyboard.Widget />
        <DateDisplay.Widget />
        <Time.Widget />
        <Dnd.Widget />
      </div>
    </div>
  );
};

export { command, refreshFrequency, render };
