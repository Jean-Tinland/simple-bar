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
import { dataWidgetLoaderStyles } from './lib/components/data/data-widget-loader.jsx'
import { dataWidgetStyles } from './lib/styles/components/data/data-widget'

import { classnames, injectStyles } from './lib/utils'
import { getSettings } from './lib/settings'

const settings = getSettings()

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
  specterStyles,
  dataWidgetLoaderStyles
])

const render = () => {
  const classes = classnames('simple-bar simple-bar--data', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-color-in-data': settings.global.noColorInData,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar
  })

  return (
    <div className={classes}>
      <Zoom />
      <BrowserTrack />
      <Spotify />
      <Music />
      <Weather />
      <Battery />
      <Mic />
      <Sound />
      <ViscosityVPN />
      <Wifi />
      <Keyboard />
      <DateDisplay />
      <Time />
    </div>
  )
}

export { render }
