import { refreshSimpleBar, mergeDeep } from './utils.js'

export const settingsLabels = {
  timeWidget: 'Time',
  dateWidget: 'Date',
  wifiWidget: 'Wifi',
  micWidget: 'Microphone',
  soundWidget: 'Sound',
  batteryWidget: 'Battery',
  spotifyWidget: 'Spotify',
  browserTrackWidget: 'Browser track'
}

// theme: 'auto' || 'dark' || 'light'
export const defaultSettings = {
  global: {
    theme: 'auto'
  },
  widgets: {
    timeWidget: true,
    dateWidget: true,
    wifiWidget: true,
    micWidget: true,
    soundWidget: true,
    batteryWidget: true,
    spotifyWidget: true,
    browserTrackWidget: true
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
