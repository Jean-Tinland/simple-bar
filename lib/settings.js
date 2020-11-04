import { refreshSimpleBar, mergeDeep } from './utils.js'

export const settingsData = {
  global: {
    label: 'Global',
    infos: ['"No bar background" is visually better with the "Floating bar" option activated']
  },
  theme: { label: 'theme', type: 'radio', options: ['auto', 'dark', 'light'] },
  floatingBar: { label: 'Floating bar', type: 'checkbox' },
  noBarBg: { label: 'No bar background', type: 'checkbox' },
  noColorInData: { label: 'No colors in data', type: 'checkbox' },
  bottomBar: { label: 'Bottom bar', type: 'checkbox' },
  shell: {
    title: 'With which shell do you want to execute simple-bar scripts?',
    label: '',
    type: 'radio',
    options: ['sh', 'bash', 'dash']
  },

  spacesDisplay: {
    label: 'Spaces',
    infos: [
      'You can declare here which apps to exclude from the spaces display',
      'Each exclusion must be separated by a comma and a space ", "'
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

  widgets: { label: 'Widgets' },
  timeWidget: { label: 'Time', type: 'checkbox' },
  dateWidget: { label: 'Date', type: 'checkbox' },
  wifiWidget: { label: 'Wifi', type: 'checkbox' },
  micWidget: { label: 'Microphone', type: 'checkbox' },
  soundWidget: { label: 'Sound', type: 'checkbox' },
  batteryWidget: { label: 'Battery', type: 'checkbox' },
  spotifyWidget: { label: 'Spotify', type: 'checkbox' },
  musicWidget: { label: 'Music/iTunes', type: 'checkbox' },
  browserTrackWidget: { label: 'Browser track', type: 'checkbox' },

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
  caffeinateOption: { label: 'Caffeinate', type: 'text', placeholder: 'example: -d' },

  timeWidgetOptions: { label: 'Time' },
  hour12: { label: '12h time format', type: 'checkbox' },
  dayProgress: { label: 'Day progress', type: 'checkbox' },

  dateWidgetOptions: { label: 'Date' },
  shortDateFormat: { label: 'Short format', type: 'checkbox' },
  locale: { label: 'Locale', type: 'text', placeholder: 'example: en-UK' },

  spotifyWidgetOptions: { label: 'Spotify' },
  musicWidgetOptions: { label: 'Music/iTunes' },
  browserTrackWidgetOptions: { label: 'Browser' },
  showSpecter: { label: 'Show specter', type: 'checkbox' }
}

export const defaultSettings = {
  global: {
    theme: 'auto',
    floatingBar: false,
    noBarBg: false,
    noColorInData: false,
    bottomBar: false,
    shell: 'sh'
  },
  spacesDisplay: {
    exclusions: '',
    titleExclusions: ''
  },
  widgets: {
    timeWidget: true,
    dateWidget: true,
    wifiWidget: true,
    micWidget: true,
    soundWidget: true,
    batteryWidget: true,
    spotifyWidget: true,
    musicWidget: true,
    browserTrackWidget: true
  },
  batteryWidgetOptions: {
    caffeinateOption: ''
  },
  timeWidgetOptions: {
    hour12: false,
    dayProgress: true
  },
  dateWidgetOptions: {
    shortDateFormat: true,
    locale: 'en-UK'
  },
  spotifyWidgetOptions: {
    showSpecter: false
  },
  musicWidgetOptions: {
    showSpecter: false
  },
  browserTrackWidgetOptions: {
    showSpecter: false
  }
}

export const getSettings = () => {
  const storedSettings = window.localStorage.getItem('simple-bar-settings')
  const settings = storedSettings ? mergeDeep(defaultSettings, JSON.parse(storedSettings)) : defaultSettings
  return settings
}

export const setSettings = (category, key, value) => {
  const settings = getSettings()
  const newSettings = { ...settings }
  newSettings[category][key] = value
  window.localStorage.setItem('simple-bar-settings', JSON.stringify(newSettings))
  refreshSimpleBar()
}
