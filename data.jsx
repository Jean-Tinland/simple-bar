import { run } from 'uebersicht'
import Time from './lib/components/Time.jsx'
import DateDisplay from './lib/components/Date.jsx'
import Weather from './lib/components/Weather.jsx'
import Battery from './lib/components/Battery.jsx'
import Sound from './lib/components/Sound.jsx'
import Mic from './lib/components/Mic.jsx'
import Wifi from './lib/components/Wifi.jsx'
import Keyboard from './lib/components/Keyboard.jsx'
import Spotify from './lib/components/Spotify.jsx'
import Music from './lib/components/Music.jsx'
import BrowserTrack from './lib/components/BrowserTrack.jsx'
import Error from './lib/components/Error.jsx'

import { parseJson, getTheme, getActiveWidgets, getLocation, setLocation, refreshData } from './lib/utils.js'
import { getSettings } from './lib/settings.js'

import { styles } from './lib/styles/Styles.js'
import CustomStyles from './lib/styles/CustomStyles.js'

const refreshFrequency = 12000

const settings = getSettings()

const theme = getTheme(settings)
const Styles = styles[theme]

const className = `
  ${Styles.BaseStyles}
  ${Styles.DateStyles}
  ${Styles.TimeStyles}
  ${Styles.WeatherStyles}
  ${Styles.BatteryStyles}
  ${Styles.WifiStyles}
  ${Styles.KeyboardStyles}
  ${Styles.MicStyles}
  ${Styles.SoundStyles}
  ${Styles.SpotifyStyles}
  ${Styles.MusicStyles}
  ${Styles.BrowserTrackStyles}
  ${Styles.SpecterStyles}

  ${settings.global.floatingBar ? Styles.FloatingBarOverride : ''}
  ${settings.global.noColorInData ? Styles.NoColorInDataOverride : ''}
  ${settings.global.noBarBg ? Styles.NoBarBgOverride : ''}
  ${settings.global.bottomBar ? Styles.BottomBarOverride : ''}
  ${settings.global.floatingBar && settings.global.bottomBar ? Styles.FloatinBottomBarOverride : ''}

  ${CustomStyles}
`

const activeWidgets = getActiveWidgets(settings)
const { shell } = settings.global
const { weatherWidget } = settings.widgets
const { networkDevice } = settings.networkWidgetOptions
const { customLocation } = settings.weatherWidgetOptions
const userLocation = customLocation !== '' ? customLocation : undefined

if (weatherWidget && !userLocation) {
  window.geolocation.getCurrentPosition(setLocation)
}

const command = () => {
  const location = weatherWidget ? getLocation() : ''
  if (weatherWidget && (!location || location === '') && !userLocation) refreshData()
  return run(
    `${shell} simple-bar/lib/scripts/get_data.sh "${activeWidgets}" "${networkDevice}" "${userLocation || location}"`
  )
}

const render = ({ output, error }) => {
  if (error) return <Error widget="data" type="error" />
  if (!output) return <Error widget="data" type="noOutput" />

  const data = parseJson(output)
  if (!data) return <Error widget="data" type="noData" />

  const { weather, battery, wifi, keyboard, mic, sound, spotify, music, browserTrack } = data

  return (
    <div className="simple-bar simple-bar--data">
      <BrowserTrack output={{ ...browserTrack, spotifyStatus: spotify.spotifyIsRunning }} />
      <Spotify output={spotify} />
      <Music output={music} />
      <Weather output={weather} />
      <Battery output={battery} />
      <Mic output={mic} />
      <Sound output={sound} />
      <Wifi output={wifi} networkDevice={networkDevice} />
      <Keyboard output={keyboard} />
      <DateDisplay />
      <Time />
    </div>
  )
}

export { command, refreshFrequency, className, render }
