import { run } from 'uebersicht'
import Zoom from './lib/components/data/zoom.jsx'
import Time from './lib/components/data/time.jsx'
import DateDisplay from './lib/components/data/date.jsx'
import Weather from './lib/components/data/weather.jsx'
import Battery from './lib/components/data/battery.jsx'
import Sound from './lib/components/data/sound.jsx'
import Mic from './lib/components/data/mic.jsx'
import Wifi from './lib/components/data/wifi.jsx'
import Keyboard from './lib/components/data/keyboard.jsx'
import Spotify from './lib/components/data/spotify.jsx'
import Music from './lib/components/data/music.jsx'
import BrowserTrack from './lib/components/data/browser-track.jsx'
import VPN from './lib/components/data/vpn.jsx'
import Error from './lib/components/error.jsx'

import { parseJson, getTheme, getActiveWidgets, getLocation, setLocation, refreshData } from './lib/utils.js'
import { getSettings } from './lib/settings.js'

import { styles } from './lib/styles/styles.js'
import CustomStyles from './lib/styles/custom-styles.js'

const refreshFrequency = 12000

const settings = getSettings()

const theme = getTheme(settings)
const Styles = styles[theme]

const className = `
  ${Styles.BaseStyles}
  ${Styles.DateStyles}
  ${Styles.ZoomStyles}
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
  ${Styles.VPNStyles}

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
const { vpnConnectionName } = settings.vpnWidgetOptions
const { customLocation } = settings.weatherWidgetOptions
const userLocation = customLocation !== '' ? customLocation : undefined

if (weatherWidget && !userLocation) {
  window.geolocation.getCurrentPosition(setLocation)
}

const command = () => {
  const location = weatherWidget ? getLocation() : ''
  if (weatherWidget && (!location || location === '') && !userLocation) refreshData()
  return run(
    `${shell} simple-bar/lib/scripts/get_data.sh "${activeWidgets}" "${networkDevice}" "${
      userLocation || location
    }" "${vpnConnectionName}"`
  )
}

const render = ({ output, error }) => {
  if (error) {
    console.log('Error in data.jsx', error)
    return <Error widget="data" type="error" />
  }
  if (!output) return <Error widget="data" type="noOutput" />

  const data = parseJson(output)
  if (!data) return <Error widget="data" type="noData" />

  const { zoom, weather, battery, wifi, keyboard, vpn, mic, sound, spotify, music, browserTrack } = data

  return (
    <div className="simple-bar simple-bar--data">
      <Zoom output={zoom} />
      <BrowserTrack output={{ ...browserTrack, spotifyStatus: spotify.spotifyIsRunning }} />
      <Spotify output={spotify} />
      <Music output={music} />
      <Weather output={weather} />
      <Battery output={battery} />
      <Mic output={mic} />
      <Sound output={sound} />
      <VPN output={vpn} vpnConnectionName={vpnConnectionName} />
      <Wifi output={wifi} networkDevice={networkDevice} />
      <Keyboard output={keyboard} />
      <DateDisplay />
      <Time />
    </div>
  )
}

export { command, refreshFrequency, className, render }
