import { run } from 'uebersicht'
import Zoom, { ZoomStyles } from './lib/components/data/zoom.jsx'
import Time, { TimeStyles } from './lib/components/data/time.jsx'
import DateDisplay, { DateStyles } from './lib/components/data/date-display.jsx'
import Weather, { WeatherStyles } from './lib/components/data/weather.jsx'
import Battery, { BatteryStyles } from './lib/components/data/battery.jsx'
import Sound, { SoundStyles } from './lib/components/data/sound.jsx'
import Mic, { MicStyles } from './lib/components/data/mic.jsx'
import Wifi, { WifiStyles } from './lib/components/data/wifi.jsx'
import Keyboard, { KeyboardStyles } from './lib/components/data/keyboard.jsx'
import Spotify, { SpotifyStyles } from './lib/components/data/spotify.jsx'
import Music, { MusicStyles } from './lib/components/data/music.jsx'
import BrowserTrack, { BrowserTrackStyles } from './lib/components/data/browser-track.jsx'
import VPN, { VPNStyles } from './lib/components/data/vpn.jsx'
import { SpecterStyles } from './lib/components/data/specter.jsx'
import Error from './lib/components/error.jsx'

import { parseJson, getActiveWidgets, getLocation, setLocation, refreshData } from './lib/utils'
import { getSettings } from './lib/settings'
import { BaseStyles } from './lib/styles/core/base'
import CustomStyles from './lib/styles/custom-styles'

const refreshFrequency = 12000

const settings = getSettings()

const className = `
  ${BaseStyles}
  ${DateStyles}
  ${ZoomStyles}
  ${TimeStyles}
  ${WeatherStyles}
  ${BatteryStyles}
  ${WifiStyles}
  ${KeyboardStyles}
  ${MicStyles}
  ${SoundStyles}
  ${SpotifyStyles}
  ${MusicStyles}
  ${BrowserTrackStyles}
  ${SpecterStyles}
  ${VPNStyles}
  ${CustomStyles}
`
// ${settings.global.floatingBar ? Styles.FloatingBarOverride : ''}
// ${settings.global.noColorInData ? Styles.NoColorInDataOverride : ''}
// ${settings.global.noBarBg ? Styles.NoBarBgOverride : ''}
// ${settings.global.bottomBar ? Styles.BottomBarOverride : ''}
// ${settings.global.floatingBar && settings.global.bottomBar ? Styles.FloatinBottomBarOverride : ''}

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
