import * as Themes from './styles/themes'
import * as Utils from './utils'
import UserWidgetsCreator from './components/settings/user-widgets-creator.jsx'

export { Component, styles } from './components/settings/settings.jsx'

const SETTINGS_STORAGE_KEY = 'simple-bar-settings'

const availableThemes = Object.keys(Themes.collection).map((key) => {
  const theme = Themes.collection[key]
  return { code: key, name: theme.name, kind: theme.kind }
})
const darkThemes = availableThemes.filter((theme) => theme.kind === 'dark')
const lightThemes = availableThemes.filter((theme) => theme.kind === 'light')

export const data = {
  global: {
    label: 'Global',
    infos: [
      '- "<b>No bar background</b>" is visually better with the "Floating bar" option activated',
      '- The higher the "<b>Sliding animation pace</b>" value, the faster the texts slides (must be > 0, default is set to 4)',
      '<br/>',
      '<b>With "external config file" activated only:</b>',
      '- External config file is located in your home directory: <b>~/.simplebarrc</b>',
      "- You'll need to manually make your import/export",
      '- Import/export cannot be done while there are pending changes',
      '<br />',
      '<b>"Use background color as foreground"</b>:',
      'This setting will remove all background colors and use the removed color for all the foreground texts'
    ]
  },
  theme: { label: 'theme', type: 'radio', options: ['auto', 'dark', 'light'] },
  floatingBar: { label: 'Floating bar', type: 'checkbox' },
  noBarBg: { label: 'No bar background', type: 'checkbox' },
  noColorInData: { label: 'No colors in data', type: 'checkbox' },
  bottomBar: { label: 'Bottom bar', type: 'checkbox' },
  inlineSpacesOptions: { label: 'Inline spaces options', type: 'checkbox' },
  disableNotifications: { label: 'Disable notifications', type: 'checkbox' },
  backgroundColorAsForeground: { label: 'Use background color as foreground', type: 'checkbox', fullWidth: true },
  font: {
    label: 'Global font',
    type: 'text',
    placeholder: 'default: JetBrains Mono',
    fullWidth: false
  },
  fontSize: {
    label: 'Font size',
    type: 'text',
    placeholder: 'default: 11px',
    fullWidth: false
  },
  yabaiPath: {
    label: 'Yabai path',
    type: 'text',
    placeholder: 'default: /usr/local/bin/yabai',
    fullWidth: true
  },
  shell: {
    title: 'With which shell do you want to execute simple-bar scripts?',
    label: '',
    type: 'radio',
    options: ['sh', 'bash', 'dash']
  },
  slidingAnimationPace: { label: 'Sliding animation pace', type: 'text', placeholder: 'Default: 4', fullWidth: true },
  externalConfigFile: { label: 'External config file', type: 'checkbox' },

  themes: { label: 'Themes' },
  darkTheme: { label: 'Dark theme', type: 'select', options: [...darkThemes] },
  lightTheme: { label: 'Light theme', type: 'select', options: [...lightThemes] },

  process: { label: 'Process' },
  displayOnlyCurrent: { label: 'Display only current process name', type: 'checkbox', fullWidth: true },
  showCurrentSpaceMode: { label: 'Show current space mode (BSP, Stack, Float)', type: 'checkbox', fullWidth: true },

  spacesDisplay: {
    label: 'Spaces',
    infos: [
      'You can declare here which apps to exclude from the spaces display',
      'Each exclusion must be separated by a comma and a space ", "',
      'These exclusions will also be applied on the process name display'
    ]
  },
  exclusions: {
    label: 'Exclusions by app name',
    type: 'text',
    placeholder: 'example: Finder, iTerm2',
    fullWidth: true
  },
  titleExclusions: {
    label: 'Exclusions by window title name',
    type: 'text',
    placeholder: 'example: Preferences',
    fullWidth: true
  },
  exclusionsAsRegex: { label: 'Use regex syntax in both exclusions fields', type: 'checkbox', fullWidth: true },
  displayAllSpacesOnAllScreens: { label: 'Display all spaces on all screens', type: 'checkbox', fullWidth: true },
  hideEmptySpaces: { label: 'Hide empty spaces', type: 'checkbox' },
  showOptionsOnHover: { label: 'Show space options on hover', type: 'checkbox' },
  hideDuplicateAppsInSpaces: {
    label: 'Hide duplicate app icons in same space (useful in combination with process widget)',
    type: 'checkbox',
    fullWidth: true
  },
  displayStickyWindowsSeparately: { label: 'Display sticky windows separately', type: 'checkbox', fullWidth: true },
  widgets: { label: 'Widgets' },
  processWidget: { label: 'Process name', type: 'checkbox' },
  zoomWidget: { label: 'Zoom', type: 'checkbox' },
  timeWidget: { label: 'Time', type: 'checkbox' },
  dateWidget: { label: 'Date', type: 'checkbox' },
  wifiWidget: { label: 'Network', type: 'checkbox' },
  micWidget: { label: 'Microphone', type: 'checkbox' },
  soundWidget: { label: 'Sound', type: 'checkbox' },
  weatherWidget: { label: 'Weather', type: 'checkbox' },
  batteryWidget: { label: 'Battery', type: 'checkbox' },
  keyboardWidget: { label: 'Keyboard', type: 'checkbox' },
  spotifyWidget: { label: 'Spotify', type: 'checkbox' },
  musicWidget: { label: 'Music/iTunes', type: 'checkbox' },
  mpdWidget: { label: 'MPD state via mpc', type: 'checkbox' },
  browserTrackWidget: { label: 'Browser track', type: 'checkbox' },
  vpnWidget: { label: 'Viscosity VPN', type: 'checkbox' },

  weatherWidgetOptions: {
    label: 'Weather',
    infos: [
      'Leave "Your location" blank in order to let simple-bar use your geolocation.',
      'Doing so, you need to allow Übersicht access to your location: a popup should appear on first use.'
    ]
  },
  unit: { title: 'Temperature unit', label: '', type: 'radio', options: ['C', 'F'] },
  hideLocation: { label: 'Hide location', type: 'checkbox' },
  hideGradient: { label: 'Hide gradient', type: 'checkbox' },
  customLocation: {
    label: 'Your location',
    type: 'text',
    placeholder: 'example: Paris',
    fullWidth: true
  },

  batteryWidgetOptions: {
    label: 'Battery',
    infos: [
      'no option (default) — Prevent the system from sleeping, not the display',
      '-d — Prevent the display from sleeping.',
      '-i — Prevent the system from idle sleeping.',
      '-s — Prevent the system from sleeping. This is valid only when system is running on AC power.',
      '-u — Declare that a user is active. If the display is off, this option turns the display on and prevents the display from going into idle sleep.',
      '-t 60 — Specifies the timeout value in seconds for which the command is valid.'
    ]
  },
  toggleCaffeinateOnClick: { label: 'Toggle caffeinate on click', type: 'checkbox' },
  caffeinateOption: { label: 'Caffeinate options', type: 'text', placeholder: 'example: -d' },

  networkWidgetOptions: {
    label: 'Network',
    infos: [
      'Here you can override the default displayed network source.',
      'And also turn Wifi on / off when clicking the Wifi icon.'
    ]
  },
  networkDevice: { label: 'Network device source name', type: 'text', placeholder: 'example: en0' },
  toggleWifiOnClick: { label: 'Toggle Wifi onclick', type: 'checkbox' },

  vpnWidgetOptions: { label: 'Viscosity VPN', infos: ['Here you can set your Viscosity vpn connection name.'] },
  vpnConnectionName: { label: 'Viscosity connection name', type: 'text', fullWidth: true },

  zoomWidgetOptions: { label: 'Zoom status', type: 'checkbox' },
  showVideo: { label: 'Show video status', type: 'checkbox' },
  showMic: { label: 'Show mic status', type: 'checkbox' },

  timeWidgetOptions: { label: 'Time' },
  hour12: { label: '12h time format', type: 'checkbox' },
  dayProgress: { label: 'Day progress', type: 'checkbox' },
  showSeconds: { label: 'Show seconds', type: 'checkbox' },

  dateWidgetOptions: { label: 'Date' },
  shortDateFormat: { label: 'Short format', type: 'checkbox' },
  locale: { label: 'Locale', type: 'text', placeholder: 'example: en-UK' },
  calendarApp: { label: 'Calendar App', type: 'text', placeholder: 'example: Fantastical', fullWidth: true },

  spotifyWidgetOptions: { label: 'Spotify' },

  musicWidgetOptions: { label: 'Music/iTunes' },

  mpdWidgetOptions: { label: 'MPD via mpc' },
  mpdHost: {
    label: 'Host',
    type: 'text',
    placeholder: 'example: 127.0.0.1'
  },
  mpdPort: {
    label: 'Port',
    type: 'text',
    placeholder: 'example: 6600'
  },
  mpdFormatString: {
    label: 'Format String (see `man mpc`)',
    type: 'text',
    placeholder: 'example: %title%[ - %artist%]|[%file%]',
    fullWidth: true
  },

  browserTrackWidgetOptions: { label: 'Browser' },
  showSpecter: { label: 'Show animated specter', type: 'checkbox' },

  userWidgets: { label: 'User widgets' },
  userWidgetsList: { type: 'component', Component: UserWidgetsCreator },

  customStyles: { label: 'Custom styles' },
  styles: { label: 'Styles', type: 'textarea', fullWidth: true, minHeight: 240 }
}

export const defaultSettings = {
  global: {
    theme: 'auto',
    floatingBar: false,
    noBarBg: false,
    noColorInData: false,
    bottomBar: false,
    inlineSpacesOptions: false,
    disableNotifications: false,
    backgroundColorAsForeground: false,
    font: 'JetBrains Mono',
    fontSize: '11px',
    yabaiPath: '/usr/local/bin/yabai',
    shell: 'sh',
    slidingAnimationPace: 4,
    externalConfigFile: false
  },
  themes: {
    lightTheme: 'NightShiftLight',
    darkTheme: 'NightShiftDark'
  },
  process: {
    displayOnlyCurrent: false,
    showCurrentSpaceMode: false
  },
  spacesDisplay: {
    exclusions: '',
    titleExclusions: '',
    exclusionsAsRegex: false,
    displayAllSpacesOnAllScreens: false,
    hideDuplicateAppsInSpaces: false,
    displayStickyWindowsSeparately: false,
    hideEmptySpaces: false,
    showOptionsOnHover: true
  },
  widgets: {
    processWidget: true,
    weatherWidget: false,
    batteryWidget: true,
    wifiWidget: true,
    vpnWidget: false,
    zoomWidget: false,
    soundWidget: true,
    micWidget: true,
    dateWidget: true,
    timeWidget: true,
    keyboardWidget: false,
    spotifyWidget: true,
    musicWidget: true,
    mpdWidget: false,
    browserTrackWidget: true
  },
  weatherWidgetOptions: {
    unit: 'C',
    hideLocation: false,
    hideGradient: false,
    customLocation: ''
  },
  zoomWidgetOptions: {
    showVideo: true,
    showMic: true
  },
  batteryWidgetOptions: {
    toggleCaffeinateOnClick: true,
    caffeinateOption: ''
  },
  networkWidgetOptions: {
    networkDevice: 'en0',
    toggleWifiOnClick: false
  },
  vpnWidgetOptions: {
    vpnConnectionName: ''
  },
  timeWidgetOptions: {
    hour12: false,
    dayProgress: true,
    showSeconds: false
  },
  dateWidgetOptions: {
    shortDateFormat: true,
    locale: 'en-UK',
    calendarApp: ''
  },
  spotifyWidgetOptions: {
    showSpecter: true
  },
  musicWidgetOptions: {
    showSpecter: true
  },
  mpdWidgetOptions: {
    showSpecter: true,
    mpdPort: '6600',
    mpdHost: '127.0.0.1',
    mpdFormatString: '%title%[ - %artist%]|[%file%]'
  },
  browserTrackWidgetOptions: {
    showSpecter: true
  },
  userWidgets: {
    userWidgetsList: {}
  },
  customStyles: {
    styles: '/* your custom css styles here */'
  }
}

export const userWidgetDefault = {
  title: 'Your widget name',
  icon: 'Widget',
  backgroundColor: '--main-alt',
  output: 'echo "Hello world!"',
  onClickAction: '',
  onRightClickAction: '',
  onMiddleClickAction: '',
  refreshFrequency: 10000
}

export const userWidgetColors = [
  '--main',
  '--main-alt',
  '--minor',
  '--accent',
  '--red',
  '--green',
  '--yellow',
  '--orange',
  '--blue',
  '--magenta',
  '--cyan'
]

export const get = () => {
  const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
  const settings = storedSettings ? Utils.mergeDeep(defaultSettings, JSON.parse(storedSettings)) : defaultSettings
  return settings
}

export const set = async (newSettings) => window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))
