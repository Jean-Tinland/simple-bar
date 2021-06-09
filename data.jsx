import Error from './lib/components/error.jsx'
import Zoom, { zoomStyles } from './lib/components/data/zoom.jsx'
import Time, { timeStyles } from './lib/components/data/time.jsx'
import DateDisplay, { dateStyles } from './lib/components/data/date-display.jsx'
import Weather, { weatherStyles } from './lib/components/data/weather.jsx'
import Battery, { batteryStyles } from './lib/components/data/battery.jsx'
import Sound, { soundStyles } from './lib/components/data/sound.jsx'
import Mic, { micStyles } from './lib/components/data/mic.jsx'
import Wifi, { wifiStyles } from './lib/components/data/wifi.jsx'
import Keyboard, { keyboardStyles } from './lib/components/data/keyboard.jsx'
import Spotify, { spotifyStyles } from './lib/components/data/spotify.jsx'
import Music, { musicStyles } from './lib/components/data/music.jsx'
import BrowserTrack, { browserTrackStyles } from './lib/components/data/browser-track.jsx'
import ViscosityVPN, { viscosityVPNStyles } from './lib/components/data/viscosity-vpn.jsx'
import { specterStyles } from './lib/components/data/specter.jsx'
import { dataWidgetStyles } from './lib/styles/components/data/data-widget.js'

import { classnames, parseJson, getActiveWidgets, injectStyles } from './lib/utils'
import { getSettings } from './lib/settings'

const refreshFrequency = 12000

const settings = getSettings()
const activeWidgets = getActiveWidgets()
const { shell } = settings.global
const { weatherWidget } = settings.widgets
const { networkDevice } = settings.networkWidgetOptions
const { vpnConnectionName } = settings.vpnWidgetOptions
const { customLocation } = settings.weatherWidgetOptions
const userLocation = customLocation.length ? customLocation : undefined

let location = ''
if (weatherWidget) {
  window.geolocation.getCurrentPosition(() => {
    const { city } = data.address
    location = city
  })
}
const params = `"${activeWidgets}" "${networkDevice}" "${userLocation || location}" "${vpnConnectionName}"`
const command = `${shell} simple-bar/lib/scripts/get_data.sh ${params}`

injectStyles('simple-bar-data-styles', [
  dataWidgetStyles,
  dateStyles,
  zoomStyles,
  timeStyles,
  weatherStyles,
  batteryStyles,
  wifiStyles,
  keyboardStyles,
  micStyles,
  soundStyles,
  spotifyStyles,
  musicStyles,
  browserTrackStyles,
  viscosityVPNStyles,
  specterStyles
])

const render = ({ output, error }) => {
  const classes = classnames('simple-bar simple-bar--data', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-color-in-data': settings.global.noColorInData,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar
  })

  if (error) {
    console.log('Error in data.jsx', error)
    return <Error widget="data" type="error" classes={classes} />
  }
  if (!output) return <Error widget="data" type="noOutput" classes={classes} />

  const data = parseJson(output)
  if (!data) return <Error widget="data" type="noData" classes={classes} />

  const { zoom, weather, battery, wifi, keyboard, vpn, mic, sound, spotify, music, browserTrack } = data
  const browserTrackOutput = { ...browserTrack, spotifyStatus: spotify.spotifyIsRunning }

  console.log('refresh')

  return (
    <div className={classes}>
      <Zoom output={zoom} />
      <BrowserTrack output={browserTrackOutput} />
      <Spotify output={spotify} />
      <Music output={music} />
      <Weather output={weather} />
      <Battery output={battery} />
      <Mic output={mic} />
      <Sound output={sound} />
      <ViscosityVPN output={vpn} />
      <Wifi output={wifi} />
      <Keyboard output={keyboard} />
      <DateDisplay />
      <Time />
    </div>
  )
}

export { command, refreshFrequency, render }
