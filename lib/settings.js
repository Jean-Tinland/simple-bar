import * as Uebersicht from "uebersicht";
import * as Themes from "./styles/themes";
import * as Utils from "./utils";
import UserWidgetsCreator from "./components/settings/user-widgets-creator.jsx";

export { Component, styles, Wrapper } from "./components/settings/settings.jsx";

const SETTINGS_STORAGE_KEY = "simple-bar-settings";

// The available themes are retrieved from the Themes collection
// They are then split into dark and light themes
const availableThemes = Object.keys(Themes.collection).map((key) => {
  const theme = Themes.collection[key];
  return { code: key, name: theme.name, kind: theme.kind };
});
const darkThemes = availableThemes.filter((theme) => theme.kind === "dark");
const lightThemes = availableThemes.filter((theme) => theme.kind === "light");

// These are all the information displayed in the settings module
export const data = {
  global: {
    label: "Global",
    documentation: "/global-settings/",
    infos: [
      '- "<b>No bar background</b>" is visually better with the "Floating bar" option activated',
      '- The higher the "<b>Sliding animation pace</b>" value, the faster the texts slides (must be > 0, default is set to 4)',
      "<br/>",
      '<b>"Use background color as foreground"</b>:',
      "This setting will remove all background colors and use the removed color for all the foreground texts",
    ],
  },
  theme: {
    label: "theme",
    type: "radio",
    options: ["auto", "dark", "light"],
    title: "Appearance & tweaks",
  },
  floatingBar: { label: "Floating bar", type: "checkbox" },
  noBarBg: { label: "No bar background", type: "checkbox" },
  noColorInData: { label: "No colors in data", type: "checkbox" },
  bottomBar: { label: "Bottom bar", type: "checkbox" },
  sideDecoration: { label: "Apple logo", type: "checkbox" },
  inlineSpacesOptions: { label: "Inline spaces options", type: "checkbox" },
  enableMissives: {
    label: "Use internal notification system (missives)",
    type: "checkbox",
    fullWidth: true,
  },
  disableNotifications: { label: "Disable notifications", type: "checkbox" },
  compactMode: { label: "Compact mode", type: "checkbox" },
  widgetMaxWidth: { label: "Widget max width", type: "text" },
  widgetsBackgroundColorAsForeground: {
    label: "Use background color as foreground for widgets",
    type: "checkbox",
    fullWidth: true,
  },
  spacesBackgroundColorAsForeground: {
    label: "Use background color as foreground for spaces & process",
    type: "checkbox",
    fullWidth: true,
  },
  font: {
    label: "Global font",
    type: "text",
    placeholder: "default: JetBrains Mono",
    fullWidth: false,
  },
  fontSize: {
    label: "Font size",
    type: "text",
    placeholder: "default: 11px",
    fullWidth: false,
  },
  yabaiPath: {
    label: "yabai path",
    type: "text",
    placeholder: "default: /opt/homebrew/bin/yabai",
    fullWidth: true,
    title: "Configuration",
  },
  aerospacePath: {
    label: "Aerospace path",
    type: "text",
    placeholder: "default: /opt/homebrew/bin/aerospace",
    fullWidth: true,
  },
  flashspacePath: {
    label: "Flashspace path",
    type: "text",
    placeholder: "default: /usr/local/bin/flashspace",
    fullWidth: true,
  },
  windowManager: {
    title: "Which window or space manager are you using?",
    label: "",
    type: "radio",
    options: ["yabai", "aerospace", "flashspace"],
  },
  shell: {
    title: "With which shell do you want to execute simple-bar scripts?",
    label: "",
    type: "radio",
    options: ["sh", "bash", "dash"],
  },
  terminal: {
    title: "Which terminal should user facing commands be run in?",
    label: "",
    type: "radio",
    options: ["Terminal", "iTerm2"],
  },
  slidingAnimationPace: {
    label: "Sliding animation speed",
    type: "number",
    placeholder: "Default: 4",
    fullWidth: true,
  },
  enableServer: {
    label: "Enable simple-bar-server connection",
    type: "checkbox",
    fullWidth: true,
    title: "simple-bar-server",
  },
  serverHttpPort: {
    label: "simple-bar-server http port",
    type: "number",
    placeholder: "Default: 7776",
    fullWidth: true,
  },
  serverSocketPort: {
    label: "simple-bar-server socket port",
    type: "number",
    placeholder: "Default: 7777",
    fullWidth: true,
  },
  yabaiServerRefresh: {
    label: "Refresh yabai spaces & process with simple-bar-server",
    type: "checkbox",
    fullWidth: true,
  },
  aerospaceServerRefresh: {
    label: "Refresh AeroSpace spaces with simple-bar-server",
    type: "checkbox",
    fullWidth: true,
  },
  flashspaceServerRefresh: {
    label: "Refresh FlashSpace spaces with simple-bar-server",
    type: "checkbox",
    fullWidth: true,
  },

  themes: {
    label: "Themes",
    documentation: "/themes-settings/",
    infos: [
      "Colors defined here will override the selected theme. Leave it empty to use the theme colors.",
      "<br/>",
      "<b>You can use any valid CSS color:</b>",
      "- named-color",
      "- hex-color",
      "- rgb()",
      "- hsl()",
      "- hwb()",
      "<br/>",
      "<b>Styles are applied in this order:</b>",
      "- Theme",
      "- Color overrides",
      "- Custom styles",
      "<br/>",
      "The last one overrides the previous ones.",
    ],
  },
  darkTheme: { label: "Dark theme", type: "select", options: darkThemes },
  lightTheme: { label: "Light theme", type: "select", options: lightThemes },
  colorMain: { label: "Main", type: "color", title: "Color overrides" },
  colorMainAlt: { label: "Main alternative", type: "color" },
  colorMinor: { label: "Minor", type: "color" },
  colorAccent: { label: "Accent", type: "color" },
  colorRed: { label: "Red", type: "color" },
  colorGreen: { label: "Green", type: "color" },
  colorYellow: { label: "Yellow", type: "color" },
  colorOrange: { label: "Orange", type: "color" },
  colorBlue: { label: "Blue", type: "color" },
  colorMagenta: { label: "Magenta", type: "color" },
  colorCyan: { label: "Cyan", type: "color" },
  colorBlack: { label: "Black", type: "color" },
  colorWhite: { label: "White", type: "color" },
  colorForeground: { label: "Foreground", type: "color" },
  colorBackground: { label: "Background", type: "color" },

  process: {
    label: "Process",
    documentation: "/process-settings/",
  },
  displayOnlyCurrent: {
    label:
      "<em>yabai</em> <em>AeroSpace</em> Display only current process name",
    type: "checkbox",
    fullWidth: true,
  },
  centered: {
    label: "<em>yabai</em> <em>AeroSpace</em> Center process widget",
    type: "checkbox",
  },
  showCurrentSpaceMode: {
    label: "<em>yabai</em> Show current space mode (BSP, Stack, Float)",
    type: "checkbox",
    fullWidth: true,
  },
  hideWindowTitle: {
    label:
      "<em>yabai</em> <em>AeroSpace</em> Hide window titles (show only app name for each process)",
    type: "checkbox",
    fullWidth: true,
  },
  displayOnlyIcon: {
    label: "<em>yabai</em> <em>AeroSpace</em> Display only process icon",
    type: "checkbox",
    fullWidth: true,
  },
  expandAllProcesses: {
    label: "<em>yabai</em> <em>AeroSpace</em> Expand all processes",
    type: "checkbox",
    fullWidth: true,
  },
  displaySkhdMode: {
    label:
      "<em>yabai</em> Display current skhd mode (requires some configuration, see readme file)",
    type: "checkbox",
    fullWidth: true,
  },
  displayStackIndex: {
    label:
      "<em>yabai</em> Display stack-index for all processes in space (if greater than 0)",
    type: "checkbox",
    fullWidth: true,
  },
  displayOnlyCurrentStack: {
    label: "<em>yabai</em> Display stack-index only for focused process",
    type: "checkbox",
    fullWidth: true,
  },
  showOnlyFlashspaceSpaceIndex: {
    label: "<em>Flashspace</em> Show only space index instead of its name",
    type: "checkbox",
    fullWidth: true,
  },
  hideFlashspaceAppIcons: {
    label: "<em>Flashspace</em> Hide app icons in Flashspace",
    type: "checkbox",
    fullWidth: true,
  },

  spacesDisplay: {
    label: "Spaces",
    documentation: "/spaces-settings/",
    infos: [
      "You can declare here which apps to exclude from the spaces display",
      'Each exclusion must be separated by a comma and a space ", "',
      "These exclusions will also be applied on the process name display",
    ],
  },
  exclusions: {
    label: "<em>yabai</em> <em>AeroSpace</em> Exclusions by app name",
    type: "text",
    placeholder: "example: Finder, iTerm2",
    fullWidth: true,
  },
  titleExclusions: {
    label: "<em>yabai</em> <em>AeroSpace</em> Exclusions by window title name",
    type: "text",
    placeholder: "example: Preferences",
    fullWidth: true,
  },
  spacesExclusions: {
    label: "<em>yabai</em> <em>AeroSpace</em> Exclude spaces by space name",
    type: "text",
    placeholder: "example: Preferences",
    fullWidth: true,
  },
  exclusionsAsRegex: {
    label:
      "<em>yabai</em> <em>AeroSpace</em> Use regex syntax in all exclusions fields",
    type: "checkbox",
    fullWidth: true,
  },
  displayAllSpacesOnAllScreens: {
    label:
      "<em>yabai</em> <em>AeroSpace</em> Display all spaces on all screens",
    type: "checkbox",
    fullWidth: true,
  },
  hideEmptySpaces: {
    label: "<em>yabai</em> <em>AeroSpace</em> Hide empty spaces",
    type: "checkbox",
  },
  showOptionsOnHover: {
    label: "<em>yabai</em> Show space options on hover",
    type: "checkbox",
    fullWidth: true,
  },
  switchSpacesWithoutYabai: {
    label: "<em>yabai</em> Switch spaces with ^⭠/^⭢ instead of yabai",
    type: "checkbox",
    fullWidth: true,
  },
  hideDuplicateAppsInSpaces: {
    label:
      "<em>yabai</em> <em>AeroSpace</em> Hide duplicate app icons in same space",
    type: "checkbox",
    fullWidth: true,
  },
  displayStickyWindowsSeparately: {
    label: "<em>yabai</em> Display sticky windows separately",
    type: "checkbox",
    fullWidth: true,
  },
  hideCreateSpaceButton: {
    label: "<em>yabai</em> Hide create space button",
    type: "checkbox",
    fullWidth: true,
  },
  widgets: {
    label: "Widgets",
    documentation: "/widgets/",
  },
  processWidget: { label: "Process name", type: "checkbox" },
  zoomWidget: { label: "Zoom", type: "checkbox" },
  timeWidget: { label: "Time", type: "checkbox" },
  dateWidget: { label: "Date", type: "checkbox" },
  wifiWidget: { label: "Network", type: "checkbox" },
  vpnWidget: { label: "Viscosity VPN", type: "checkbox" },
  micWidget: { label: "Microphone", type: "checkbox" },
  soundWidget: { label: "Sound", type: "checkbox" },
  weatherWidget: { label: "Weather", type: "checkbox" },
  netstatsWidget: { label: "Network stats", type: "checkbox" },
  cpuWidget: { label: "CPU", type: "checkbox" },
  gpuWidget: { label: "GPU", type: "checkbox" },
  memoryWidget: { label: "Memory", type: "checkbox" },
  batteryWidget: { label: "Battery", type: "checkbox" },
  keyboardWidget: { label: "Keyboard", type: "checkbox" },
  spotifyWidget: { label: "Spotify", type: "checkbox" },
  youtubeMusicWidget: { label: "YouTube Music", type: "checkbox" },
  cryptoWidget: { label: "Crypto", type: "checkbox" },
  stockWidget: { label: "Stock", type: "checkbox" },
  musicWidget: { label: "Music/iTunes", type: "checkbox" },
  mpdWidget: { label: "MPD state via mpc", type: "checkbox" },
  browserTrackWidget: { label: "Browser track", type: "checkbox" },

  showOnDisplay: {
    label: "Show on display n°",
    type: "text",
    placeholder: "example: 1,2 (leave blank to show on all displays)",
    fullWidth: true,
  },

  weatherWidgetOptions: {
    label: "Weather",
    documentation: "/weather/",
    infos: [
      'Leave "Your location" blank in order to let simple-bar use your geolocation.',
      "Doing so, you need to allow Übersicht access to your location: a popup should appear on first use.",
    ],
  },
  unit: {
    title: "Temperature unit",
    label: "",
    type: "radio",
    options: ["C", "F"],
  },
  hideLocation: { label: "Hide location", type: "checkbox" },
  hideGradient: { label: "Hide gradient", type: "checkbox" },
  customLocation: {
    label: "Your location",
    type: "text",
    placeholder: "example: Paris",
    fullWidth: true,
  },

  netstatsWidgetOptions: {
    label: "Network stats",
    documentation: "/network-stats/",
    infos: [
      "Here you can set the refresh frequency of the widget.",
      "The default value is set to 2000 ms (2 seconds).",
    ],
  },

  cpuWidgetOptions: {
    label: "CPU usage",
    documentation: "/cpu/",
    infos: [
      "Here you can set the refresh frequency of the widget.",
      "The default value is set to 2000 ms (2 seconds).",
    ],
  },

  gpuWidgetOptions: {
    label: "GPU usage",
    documentation: "/gpu/",
    infos: [
      "Here you can set the refresh frequency of the widget.",
      "The default value is set to 2000 ms (2 seconds).",
    ],
  },

  gpuMacmonBinaryPath: {
    label: "Path to macmon binary",
    type: "text",
    placeholder: "example: /opt/homebrew/bin/macmon",
    fullWidth: true,
  },

  memoryWidgetOptions: {
    label: "Memory pressure",
    documentation: "/memory-pressure/",
    infos: [
      "Here you can set the refresh frequency of the widget.",
      "The default value is set to 4000 ms (4 seconds).",
    ],
  },

  displayAsGraph: {
    label: "Display as graph",
    type: "checkbox",
    fullWidth: true,
  },

  cpuMonitorApp: {
    title: "Cpu monitor app",
    label: "",
    type: "radio",
    options: ["Top", "Activity Monitor", "None"],
  },

  memoryMonitorApp: {
    title: " app",
    label: "",
    type: "radio",
    options: ["Top", "Activity Monitor", "None"],
  },

  batteryWidgetOptions: {
    label: "Battery",
    documentation: "/battery/",
    infos: [
      "no option (default) — Prevent the system from sleeping, not the display",
      "-d — Prevent the display from sleeping.",
      "-i — Prevent the system from idle sleeping.",
      "-s — Prevent the system from sleeping. This is valid only when system is running on AC power.",
      "-u — Declare that a user is active. If the display is off, this option turns the display on and prevents the display from going into idle sleep.",
      "-t 60 — Specifies the timeout value in seconds for which the command is valid.",
    ],
  },
  toggleCaffeinateOnClick: {
    label: "Toggle caffeinate on click",
    type: "checkbox",
    fullWidth: true,
  },
  caffeinateOption: {
    label: "Caffeinate options",
    type: "text",
    placeholder: "example: -d",
  },

  networkWidgetOptions: {
    label: "Network",
    documentation: "/network/",
    infos: [
      "Here you can override the default displayed network source.",
      "And also turn Wifi on / off when clicking the Wifi icon.",
      "Additionally, you can choose to hide the network name for privacy.",
    ],
  },
  networkDevice: {
    label: "Network device source name",
    type: "text",
    placeholder: "example: en0",
  },
  hideWifiIfDisabled: { label: "Hide if disabled", type: "checkbox" },
  toggleWifiOnClick: { label: "Toggle Wifi onclick", type: "checkbox" },
  hideNetworkName: { label: "Hide network name", type: "checkbox" },

  vpnWidgetOptions: {
    label: "Viscosity VPN",
    documentation: "/viscosity-vpn/",
    infos: ["Here you can set your Viscosity vpn connection name."],
  },
  vpnConnectionName: {
    label: "Viscosity connection name",
    type: "text",
    fullWidth: true,
  },
  vpnShowConnectionName: {
    label: "Display the connection name in the widget",
    type: "checkbox",
    fullWidth: true,
  },

  zoomWidgetOptions: {
    label: "Zoom status",
    documentation: "/zoom/",
  },
  showVideo: { label: "Show video status", type: "checkbox" },
  showMic: { label: "Show mic status", type: "checkbox" },

  soundWidgetOptions: {
    label: "Sound",
    documentation: "/sound/",
  },
  micWidgetOptions: {
    label: "Mic",
    documentation: "/microphone/",
  },
  keyboardWidgetOptions: {
    label: "Keyboard",
    documentation: "/keyboard/",
  },

  timeWidgetOptions: {
    label: "Time",
    documentation: "/time/",
  },
  hour12: { label: "12h time format", type: "checkbox" },
  dayProgress: { label: "Day progress", type: "checkbox" },
  showSeconds: { label: "Show seconds", type: "checkbox" },

  dateWidgetOptions: {
    label: "Date",
    documentation: "/date/",
  },
  shortDateFormat: { label: "Short format", type: "checkbox" },
  locale: { label: "Locale", type: "text", placeholder: "example: en-UK" },
  calendarApp: {
    label: "Calendar App",
    type: "text",
    placeholder: "example: Fantastical",
    fullWidth: true,
  },

  youtubeMusicWidgetOptions: {
    label: "YouTube Music",
  },
  spotifyWidgetOptions: {
    label: "Spotify",
    documentation: "/spotify/",
  },
  cryptoWidgetOptions: {
    label: "Crypto",
    documentation: "/crypto/",
  },
  stockWidgetOptions: {
    label: "Stock",
    documentation: "/stocks/",
    infos: [
      "Here you can configure your API key for the Yahoo Finance API.",
      "If you haven't gotten one yet, go to https://www.yahoofinanceapi.com/.",
      "You can register for free and use the Basic tier (100 requests/day).",
    ],
  },

  musicWidgetOptions: {
    label: "Music/iTunes",
    documentation: "/music-itunes/",
  },

  mpdWidgetOptions: {
    label: "MPD via mpc",
    documentation: "/mpd-state-via-mpc/",
  },
  mpdBinaryPath: {
    label: "Path to mpc binary",
    type: "text",
    placeholder: "example: /opt/homebrew/bin/mpc",
    fullWidth: true,
  },
  mpdHost: {
    label: "Host",
    type: "text",
    placeholder: "example: 127.0.0.1",
  },
  mpdPort: {
    label: "Port",
    type: "text",
    placeholder: "example: 6600",
  },
  mpdFormatString: {
    label: "Format String (see `man mpc`)",
    type: "text",
    placeholder: "example: %title%[ - %artist%]|[%file%]",
    fullWidth: true,
  },

  browserTrackWidgetOptions: {
    label: "Browser",
    documentation: "/browser-track/",
  },
  showSpecter: { label: "Show animated specter", type: "checkbox" },
  youtubeMusicPort: { label: "Port", type: "text", placeholder: "26538" },

  denomination: { label: "Denomination", type: "text", placeholder: "usd" },
  identifiers: {
    label: "Identifiers",
    type: "text",
    placeholder: "celo,bitcoin,ethereum",
  },
  precision: { label: "Decimals rounding", type: "text", placeholder: 5 },

  symbols: {
    label: "Symbols for your stocks, ETFs, mutual funds, ...",
    type: "text",
    placeholder: "AAPL,TSLA",
    fullWidth: true,
  },
  yahooFinanceApiKey: {
    label: "Your API key for Yahoo Finance",
    type: "text",
    placeholder: "YOUR_API_KEY",
    fullWidth: true,
  },
  showSymbol: { label: "Show symbol", type: "checkbox" },
  showCurrency: { label: "Show currency", type: "checkbox" },
  showMarketPrice: { label: "Show market price", type: "checkbox" },
  showMarketChange: { label: "Show market change", type: "checkbox" },
  showMarketPercent: { label: "Show market change percent", type: "checkbox" },
  showColor: {
    label: "Show colored output for market change",
    type: "checkbox",
  },

  userWidgets: {
    label: "User widgets",
    documentation: "/custom-widgets/",
  },
  userWidgetsList: { type: "component", Component: UserWidgetsCreator },

  refreshFrequency: { label: "Refresh frequency (in ms)", type: "number" },

  customStyles: {
    label: "Custom styles",
    documentation: "/custom-styles/",
  },
  styles: {
    label: "Styles",
    type: "textarea",
    fullWidth: true,
    minHeight: 240,
  },
};

// Default settings are defined here
export const defaultSettings = {
  global: {
    theme: "auto",
    compactMode: false,
    floatingBar: false,
    noBarBg: false,
    noColorInData: false,
    bottomBar: false,
    sideDecoration: false,
    inlineSpacesOptions: false,
    spacesBackgroundColorAsForeground: false,
    widgetsBackgroundColorAsForeground: false,
    widgetMaxWidth: "160px",
    slidingAnimationPace: 4,
    font: "JetBrains Mono, Monaco, Menlo, monospace",
    fontSize: "11px",
    yabaiPath: "/opt/homebrew/bin/yabai",
    aerospacePath: "/opt/homebrew/bin/aerospace",
    flashspacePath: "/usr/local/bin/flashspace",
    windowManager: "yabai",
    shell: "sh",
    terminal: "Terminal",
    disableNotifications: false,
    enableMissives: false,
    enableServer: false,
    serverSocketPort: 7777,
    yabaiServerRefresh: false,
    aerospaceServerRefresh: false,
    flashspaceServerRefresh: false,
  },
  themes: {
    lightTheme: "NightShiftLight",
    darkTheme: "NightShiftDark",
    colorMain: "",
    colorMainAlt: "",
    colorMinor: "",
    colorAccent: "",
    colorRed: "",
    colorGreen: "",
    colorYellow: "",
    colorOrange: "",
    colorBlue: "",
    colorMagenta: "",
    colorCyan: "",
    colorBlack: "",
    colorWhite: "",
    colorForeground: "",
    colorBackground: "",
  },
  process: {
    showOnDisplay: "",
    displayOnlyCurrent: false,
    centered: false,
    showCurrentSpaceMode: false,
    hideWindowTitle: false,
    displayOnlyIcon: false,
    expandAllProcesses: false,
    displaySkhdMode: false,
    displayStackIndex: true,
    displayOnlyCurrentStack: false,
  },
  spacesDisplay: {
    showOnDisplay: "",
    exclusions: "",
    titleExclusions: "",
    spacesExclusions: "",
    exclusionsAsRegex: false,
    displayAllSpacesOnAllScreens: false,
    hideDuplicateAppsInSpaces: false,
    displayStickyWindowsSeparately: false,
    hideCreateSpaceButton: false,
    hideEmptySpaces: false,
    showOptionsOnHover: true,
    switchSpacesWithoutYabai: false,
    showOnlyFlashspaceSpaceIndex: false,
    hideFlashspaceAppIcons: false,
  },
  widgets: {
    processWidget: true,
    weatherWidget: false,
    netstatsWidget: false,
    cpuWidget: false,
    gpuWidget: false,
    memoryWidget: false,
    batteryWidget: true,
    wifiWidget: true,
    vpnWidget: false,
    zoomWidget: false,
    soundWidget: true,
    micWidget: false,
    dateWidget: true,
    timeWidget: true,
    keyboardWidget: false,
    spotifyWidget: true,
    cryptoWidget: false,
    stockWidget: false,
    youtubeMusicWidget: false,
    musicWidget: true,
    mpdWidget: false,
    browserTrackWidget: false,
  },
  weatherWidgetOptions: {
    refreshFrequency: 1000 * 60 * 30,
    showOnDisplay: "",
    unit: "C",
    hideLocation: false,
    hideGradient: false,
    customLocation: "",
  },
  netstatsWidgetOptions: {
    refreshFrequency: 2000,
    showOnDisplay: "",
    displayAsGraph: false,
  },
  cpuWidgetOptions: {
    refreshFrequency: 2000,
    showOnDisplay: "",
    displayAsGraph: false,
    cpuMonitorApp: "Activity Monitor",
  },
  gpuWidgetOptions: {
    refreshFrequency: 3000,
    showOnDisplay: "",
    displayAsGraph: false,
    gpuMacmonBinaryPath: "/opt/homebrew/bin/macmon",
  },
  memoryWidgetOptions: {
    refreshFrequency: 4000,
    showOnDisplay: "",
    memoryMonitorApp: "Activity Monitor",
  },
  batteryWidgetOptions: {
    refreshFrequency: 10000,
    showOnDisplay: "",
    toggleCaffeinateOnClick: true,
    caffeinateOption: "",
  },
  networkWidgetOptions: {
    refreshFrequency: 20000,
    showOnDisplay: "",
    networkDevice: "en0",
    hideWifiIfDisabled: false,
    toggleWifiOnClick: false,
    hideNetworkName: false,
  },
  vpnWidgetOptions: {
    refreshFrequency: 8000,
    showOnDisplay: "",
    vpnConnectionName: "",
    vpnShowConnectionName: false,
  },
  zoomWidgetOptions: {
    refreshFrequency: 5000,
    showOnDisplay: "",
    showVideo: true,
    showMic: true,
  },
  soundWidgetOptions: {
    refreshFrequency: 20000,
    showOnDisplay: "",
  },
  micWidgetOptions: {
    refreshFrequency: 20000,
    showOnDisplay: "",
  },
  dateWidgetOptions: {
    refreshFrequency: 30000,
    showOnDisplay: "",
    shortDateFormat: true,
    locale: "en-UK",
    calendarApp: "",
  },
  timeWidgetOptions: {
    refreshFrequency: 1000,
    showOnDisplay: "",
    hour12: false,
    dayProgress: true,
    showSeconds: false,
  },
  keyboardWidgetOptions: {
    refreshFrequency: 20000,
    showOnDisplay: "",
  },
  cryptoWidgetOptions: {
    refreshFrequency: 5 * 60 * 1000,
    showOnDisplay: "",
    denomination: "usd",
    identifiers: "bitcoin,ethereum,celo",
    precision: 5,
  },
  stockWidgetOptions: {
    refreshFrequency: 15 * 60 * 1000,
    showOnDisplay: "",
    yahooFinanceApiKey: "YOUR_API_KEY",
    symbols: "AAPL,TSLA",
    showSymbol: true,
    showCurrency: true,
    showMarketPrice: true,
    showMarketChange: false,
    showMarketPercent: true,
    showColor: true,
  },
  spotifyWidgetOptions: {
    refreshFrequency: 10000,
    showOnDisplay: "",
    showSpecter: true,
  },
  youtubeMusicWidgetOptions: {
    refreshFrequency: 10000,
    showOnDisplay: "",
    showSpecter: true,
    youtubeMusicPort: 26538,
  },
  musicWidgetOptions: {
    refreshFrequency: 10000,
    showOnDisplay: "",
    showSpecter: true,
  },
  mpdWidgetOptions: {
    refreshFrequency: 10000,
    showOnDisplay: "",
    showSpecter: true,
    mpdBinaryPath: "/opt/homebrew/bin/mpc",
    mpdPort: "6600",
    mpdHost: "127.0.0.1",
    mpdFormatString: "%title%[ - %artist%]|[%file%]",
  },
  browserTrackWidgetOptions: {
    refreshFrequency: 10000,
    showOnDisplay: "",
    showSpecter: true,
  },
  userWidgets: {
    userWidgetsList: {},
  },
  customStyles: {
    styles: "/* your custom css styles here */",
  },
};

// User widget default settings
export const userWidgetDefault = {
  title: "Your widget name",
  icon: "Widget",
  backgroundColor: "--main-alt",
  output: 'echo "Hello world!"',
  onClickAction: "",
  onRightClickAction: "",
  onMiddleClickAction: "",
  refreshFrequency: 10000,
  showOnDisplay: "",
  active: true,
  noIcon: false,
};

// Colors available for user widgets
export const userWidgetColors = [
  "--main",
  "--main-alt",
  "--minor",
  "--accent",
  "--red",
  "--green",
  "--yellow",
  "--orange",
  "--blue",
  "--magenta",
  "--cyan",
];

/**
 * Retrieves the application settings from local storage.
 * If no settings are found, the default settings are used.
 * The settings schema is removed before returning the settings.
 *
 * @returns {Object} The application settings.
 */
export function get() {
  const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  const settings = storedSettings
    ? Utils.mergeDeep(defaultSettings, JSON.parse(storedSettings))
    : defaultSettings;
  delete settings.$schema;
  return settings;
}

/**
 * Updates the settings by merging them with the schema, saving them to a config file,
 * and storing them in the local storage.
 *
 * @param {Object} newSettings - The new settings to be applied.
 * @returns {Promise<void>} A promise that resolves when the settings have been saved.
 */
export async function set(newSettings) {
  pruneObsoleteSettings(newSettings);
  const settingsWithSchema = {
    $schema:
      "https://raw.githubusercontent.com/Jean-Tinland/simple-bar/refs/heads/master/lib/schemas/config.json",
    ...newSettings,
  };
  await saveToConfigFile(settingsWithSchema);
  window.localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(settingsWithSchema),
  );
}

/**
 * Saves the provided settings to the configuration file.
 *
 * @param {Object} newSettings - The new settings to be saved.
 * @returns {Promise<void>} A promise that resolves when the settings have been saved.
 * @throws Will throw an error if the settings cannot be saved.
 */
async function saveToConfigFile(newSettings) {
  try {
    const settings = JSON.stringify(newSettings, undefined, 2);
    const cleanSettings = settings.replace(/'/g, "'\"'\"'");
    await Uebersicht.run(`echo '${cleanSettings}' | tee ~/.simplebarrc`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

/**
 * Checks if the configuration file for simple-bar exists.
 *
 * This function runs a shell command to check for the presence of the
 * configuration file located at `~/.simplebarrc`. If the file exists,
 * the function returns `true`; otherwise, it returns `false`.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the
 * configuration file exists, and `false` otherwise.
 */
export async function checkIfConfigFileExists() {
  let exists = false;
  try {
    exists = Boolean(await Uebersicht.run(`ls ~/.simplebarrc`));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return exists;
}

/**
 * Removes obsolete settings from the provided settings object.
 *
 * @param {Object} settings - The settings object to prune.
 * @param {Object} settings.global - The global settings object.
 * @param {string} settings.global.externalConfigFile - The external configuration file setting to be removed.
 * @param {Object} settings.widgets - The widgets settings object.
 * @param {Object} settings.widgets.dndWidget - The dndWidget setting to be removed.
 * @param {Object} settings.widgets.undefined - The undefined widget setting to be removed.
 */
function pruneObsoleteSettings(settings) {
  delete settings.global.externalConfigFile;
  delete settings.widgets.dndWidget;
  delete settings.widgets.undefined;
}

/**
 * Loads the external configuration file for simple-bar.
 */
export async function loadExternalConfig() {
  const configFileExists = await checkIfConfigFileExists();
  if (!configFileExists) return;
  try {
    const config = JSON.parse(await Uebersicht.run(`cat ~/.simplebarrc`));
    const settings = Utils.mergeDeep(defaultSettings, config);
    return settings;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Error loading external config:", e);
  }
}

/** */
export async function init() {
  const externalConfig = await loadExternalConfig();
  if (externalConfig) {
    set(externalConfig);
  }
}
