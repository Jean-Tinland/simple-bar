import UserWidgets from './lib/components/data/user-widgets.jsx'
import * as Zoom from './lib/components/data/zoom.jsx'
import * as Time from './lib/components/data/time.jsx'
import * as DateDisplay from './lib/components/data/date-display.jsx'
import * as Weather from './lib/components/data/weather.jsx'
import * as Battery from './lib/components/data/battery.jsx'
import * as Sound from './lib/components/data/sound.jsx'
import * as Mic from './lib/components/data/mic.jsx'
import * as Wifi from './lib/components/data/wifi.jsx'
import * as ViscosityVPN from './lib/components/data/viscosity-vpn.jsx'
import * as Keyboard from './lib/components/data/keyboard.jsx'
import * as Spotify from './lib/components/data/spotify.jsx'
import * as Crypto from './lib/components/data/crypto.jsx'
import * as Stock from './lib/components/data/stock.jsx'
import * as Music from './lib/components/data/music.jsx'
import * as Mpd from './lib/components/data/mpd.jsx'
import * as BrowserTrack from './lib/components/data/browser-track.jsx'
import * as Dnd from './lib/components/data/dnd.jsx'
import * as Specter from './lib/components/data/specter.jsx'
import * as DataWidgetLoader from './lib/components/data/data-widget-loader.jsx'
import * as DataWidget from './lib/components/data/data-widget.jsx'

import * as Utils from './lib/utils'
import * as Settings from './lib/settings'

const refreshFrequency = false

const settings = Settings.get()

Utils.injectStyles('simple-bar-data-styles', [
  DataWidget.styles,
  DateDisplay.styles,
  Zoom.styles,
  Time.styles,
  Weather.styles,
  Crypto.styles,
  Stock.styles,
  Battery.styles,
  Wifi.styles,
  ViscosityVPN.styles,
  Keyboard.styles,
  Mic.styles,
  Sound.styles,
  Spotify.styles,
  Music.styles,
  Mpd.styles,
  BrowserTrack.styles,
  Dnd.styles,
  Specter.styles,
  DataWidgetLoader.styles
])

const render = () => {
  const classes = Utils.classnames('simple-bar simple-bar--data', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-color-in-data': settings.global.noColorInData,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar,
    'simple-bar--background-color-as-foreground': settings.global.widgetsBackgroundColorAsForeground
  })

  return (
    <div className={classes}>
      <UserWidgets />
      <Zoom.Widget />
      <BrowserTrack.Widget />
      <Spotify.Widget />
      <Crypto.Widget />
      <Stock.Widget />
      <Music.Widget />
      <Mpd.Widget />
      <Weather.Widget />
      <Battery.Widget />
      <Mic.Widget />
      <Sound.Widget />
      <ViscosityVPN.Widget />
      <Wifi.Widget />
      <Keyboard.Widget />
      <DateDisplay.Widget />
      <Time.Widget />
      <Dnd.Widget />
    </div>
  )
}

export { refreshFrequency, render }
