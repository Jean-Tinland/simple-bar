import { refreshSimpleBar, mergeDeep } from './utils.js'

export const settingsLabels = {
  timeWidget: 'Time',
  dateWidget: 'Date',
  wifiWidget: 'Wifi',
  micWidget: 'Microphone',
  soundWidget: 'Sound',
  batteryWidget: 'Battery',
  spotifyWidget: 'Spotify',
  vpnWidget: 'VPN',
  musicWidget: 'Music/iTunes',
  browserTrackWidget: 'Browser track',
  hour12: '12h time format',
  dayProgress: 'Day progress',
  shortDateFormat: 'Short format',
  locale: 'Locale',
  floatingBar: 'Floating bar',
  noBarBg: 'No bar background',
  noColorInData: 'No colors in data',
  bottomBar: 'Bottom bar',
  showSpecter: 'Show specter'
}

// theme: 'auto' || 'dark' || 'light'
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
    vpnWidget: true,
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

export const setSettings = (category, key, value, widgetToRefresh = 'all') => {
  const settings = getSettings()
  const newSettings = { ...settings }
  newSettings[category][key] = value
  window.localStorage.setItem('simple-bar-settings', JSON.stringify(newSettings))
  refreshSimpleBar(widgetToRefresh)
}
