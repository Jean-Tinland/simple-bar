import * as Uebersicht from "uebersicht";
import * as Error from "./lib/components/error.jsx";
import SimpleBarContextProvider from "./lib/components/simple-bar-context.jsx";
import YabaiContextProvider from "./lib/components/yabai-context.jsx";
import AerospaceContextProvider from "./lib/components/aerospace-context.jsx";
import UserWidgets from "./lib/components/data/user-widgets.jsx";
// Each simple-bar widgets exports both a "Component" or "Widget" render function
// and a "styles" string containing its own CSS
import * as YabaiSpaces from "./lib/components/yabai/spaces.jsx";
import * as YabaiProcess from "./lib/components/yabai/process.jsx";
import * as AerospaceSpaces from "./lib/components/aerospace/spaces.jsx";
import * as AerospaceProcess from "./lib/components/aerospace/process.jsx";
import * as Variables from "./lib/styles/core/variables";
import * as Base from "./lib/styles/core/base";
import * as Zoom from "./lib/components/data/zoom.jsx";
import * as Time from "./lib/components/data/time.jsx";
import * as DateDisplay from "./lib/components/data/date-display.jsx";
import * as Weather from "./lib/components/data/weather.jsx";
import * as Netstats from "./lib/components/data/netstats.jsx";
import * as Cpu from "./lib/components/data/cpu.jsx";
import * as Gpu from "./lib/components/data/gpu.jsx";
import * as Memory from "./lib/components/data/memory.jsx";
import * as Battery from "./lib/components/data/battery.jsx";
import * as Sound from "./lib/components/data/sound.jsx";
import * as Mic from "./lib/components/data/mic.jsx";
import * as Wifi from "./lib/components/data/wifi.jsx";
import * as ViscosityVPN from "./lib/components/data/viscosity-vpn.jsx";
import * as Keyboard from "./lib/components/data/keyboard.jsx";
import * as Spotify from "./lib/components/data/spotify.jsx";
import * as YouTubeMusic from "./lib/components/data/youtube-music.jsx";
import * as Crypto from "./lib/components/data/crypto.jsx";
import * as Stock from "./lib/components/data/stock.jsx";
import * as Music from "./lib/components/data/music.jsx";
import * as Mpd from "./lib/components/data/mpd.jsx";
import * as BrowserTrack from "./lib/components/data/browser-track.jsx";
import * as Specter from "./lib/components/data/specter.jsx";
import * as Graph from "./lib/components/data/graph.jsx";
import * as DataWidgetLoader from "./lib/components/data/data-widget-loader.jsx";
import * as DataWidget from "./lib/components/data/data-widget.jsx";
import * as SideIcon from "./lib/components/side-icon.jsx";
import * as Missives from "./lib/components/missives/missives.jsx";
import * as Utils from "./lib/utils";
import * as Settings from "./lib/settings";

// Destructure React from Uebersicht in order to make eslint catch hook rules for example
const { React } = Uebersicht;

// Set refresh frequency to false
// Übersicht auto-refresh system is not required as simple-bar works in sync with
// yabai or AeroSpaces for spaces & process widgets and data widgets are refreshed with
// their local refresh functions
const refreshFrequency = false;

// Get settings from the Settings module
const settings = Settings.get();
const {
  // Do not edit the yabaiPath or aerospacePath lines, theses values are simply
  // a default value used if nothing is defined in settings.
  // You can setup your custom yabai or AeroSpace path in the settings module (Global tab) :
  // while on an empty workspace, click on simple-bar then press cmd + , to open it.
  yabaiPath = "/opt/homebrew/bin/yabai",
  aerospacePath = "/opt/homebrew/bin/aerospace",
  windowManager, // Window manager type (yabai or aerospace)
  shell, // Shell to use for commands
  enableServer, // Enable server mode
  yabaiServerRefresh, // Refresh rate for yabai server
} = settings.global;
const { hideWindowTitle, displayOnlyIcon, displaySkhdMode } = settings.process;

// Determine if signals should be disabled based on settings
const disableSignals = enableServer && yabaiServerRefresh;
const enableTitleChangedSignal = !hideWindowTitle && !displayOnlyIcon;

// Construct command arguments based on window manager type
const yabaiArgs = `${yabaiPath} ${displaySkhdMode} ${disableSignals} ${enableTitleChangedSignal}`;
const aerospaceArgs = `${aerospacePath}`;
const args = windowManager === "yabai" ? yabaiArgs : aerospaceArgs;
const command = `${shell} simple-bar/lib/scripts/init-${windowManager}.sh ${args}`;

// Inject global styles into the document.
// I prefer using native CSS instead of Emotion bundled by default in Übersicht
Utils.injectStyles("simple-bar-index-styles", [
  Variables.styles,
  Base.styles,
  YabaiSpaces.styles,
  YabaiProcess.styles,
  Settings.styles,
  DataWidget.styles,
  DateDisplay.styles,
  Zoom.styles,
  Time.styles,
  Weather.styles,
  Netstats.styles,
  Cpu.styles,
  Gpu.styles,
  Memory.styles,
  Crypto.styles,
  Stock.styles,
  Battery.styles,
  Wifi.styles,
  ViscosityVPN.styles,
  Keyboard.styles,
  Mic.styles,
  Sound.styles,
  Spotify.styles,
  YouTubeMusic.styles,
  Music.styles,
  Mpd.styles,
  BrowserTrack.styles,
  Specter.styles,
  Graph.styles,
  DataWidgetLoader.styles,
  settings.customStyles.styles,
  SideIcon.styles,
  Missives.styles,
]);

// Render function to display the bar
function render({ output, error }) {
  // Define base classes for the bar based on settings
  const baseClasses = Utils.classNames("simple-bar", {
    "simple-bar--floating": settings.global.floatingBar,
    "simple-bar--no-bar-background": settings.global.noBarBg,
    "simple-bar--no-color-in-data": settings.global.noColorInData,
    "simple-bar--on-bottom": settings.global.bottomBar,
    "simple-bar--inline-spaces-options": settings.global.inlineSpacesOptions,
    "simple-bar--spaces-background-color-as-foreground":
      settings.global.spacesBackgroundColorAsForeground,
    "simple-bar--widgets-background-color-as-foreground":
      settings.global.widgetsBackgroundColorAsForeground,
    "simple-bar--process-aligned-to-left": !settings.global.centered,
  });

  // Handle errors
  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error in index.jsx", error);
    return <Error.Component type="error" classes={baseClasses} />;
  }
  if (!output) {
    return <Error.Component type="noOutput" classes={baseClasses} />;
  }
  if (Utils.cleanupOutput(output) === "yabaiError") {
    return <Error.Component type="yabaiError" classes={baseClasses} />;
  }
  if (Utils.cleanupOutput(output) === "aerospaceError") {
    return <Error.Component type="aerospaceError" classes={baseClasses} />;
  }

  // Parse the output data
  const data = Utils.parseJson(output);
  if (!data) return <Error.Component type="noData" classes={baseClasses} />;

  const { displays, shadow, skhdMode, SIP, spaces, windows } = data;

  // Check if SIP (System Integrity Protection) is disabled
  const SIPDisabled = SIP !== "System Integrity Protection status: enabled.";

  // Define additional classes based on data
  const classes = Utils.classNames(baseClasses, {
    "simple-bar--no-shadow": shadow !== "on",
  });

  // Handle bar focus ring on click
  Utils.handleBarFocus();

  // Render the bar with appropriate components and data
  return (
    <SimpleBarContextProvider
      initialSettings={settings}
      displays={displays}
      SIPDisabled={SIPDisabled}
    >
      <div className={classes}>
        <SideIcon.Component />
        {windowManager === "yabai" ? (
          <YabaiContextProvider
            spaces={spaces}
            windows={windows}
            skhdMode={skhdMode}
          >
            <YabaiSpaces.Component />
            <YabaiProcess.Component />
          </YabaiContextProvider>
        ) : (
          <AerospaceContextProvider>
            <AerospaceSpaces.Component />
            <AerospaceProcess.Component />
          </AerospaceContextProvider>
        )}
        <Settings.Wrapper />
        <div className="simple-bar__data">
          <UserWidgets />
          <Zoom.Widget />
          <BrowserTrack.Widget />
          <Spotify.Widget />
          <YouTubeMusic.Widget />
          <Crypto.Widget />
          <Stock.Widget />
          <Music.Widget />
          <Mpd.Widget />
          <Weather.Widget />
          <Netstats.Widget />
          <Cpu.Widget />
          <Gpu.Widget />
          <Memory.Widget />
          <Battery.Widget />
          <Mic.Widget />
          <Sound.Widget />
          <ViscosityVPN.Widget />
          <Wifi.Widget />
          <Keyboard.Widget />
          <DateDisplay.Widget />
          <Time.Widget />
        </div>
        <Missives.Component />
      </div>
    </SimpleBarContextProvider>
  );
}

export { command, refreshFrequency, render };
