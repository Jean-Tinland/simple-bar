import { refreshSimpleBar, mergeDeep } from './utils.js'

export const settingsData = {
  global: { label: 'Global', info: '"No bar background" is visually better with the "Floating bar" option activated' },
  theme: { label: 'Theme', type: 'radio', options: ['auto', 'dark', 'light'] },
  floatingBar: { label: 'Floating bar', type: 'checkbox' },
  noBarBg: { label: 'No bar background', type: 'checkbox' },
  noColorInData: { label: 'No colors in data', type: 'checkbox' },
  bottomBar: { label: 'Bottom bar', type: 'checkbox' },

  spacesDisplay: { label: 'Spaces', info: 'Each exclusion must be separated by a comma and a space ", "' },
  exclusions: { label: 'Exclusions', type: 'text', placeholder: 'example: Finder, iTerm2' },

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
    bottomBar: false
  },
  spacesDisplay: {
    exclusions: ''
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
