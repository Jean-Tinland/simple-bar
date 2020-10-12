import Time from './lib/components/Time.jsx'
import DateDisplay from './lib/components/Date.jsx'
import Battery from './lib/components/Battery.jsx'
import Sound from './lib/components/Sound.jsx'
import Mic from './lib/components/Mic.jsx'
import Wifi from './lib/components/Wifi.jsx'
import Spotify from './lib/components/Spotify.jsx'
import BrowserTrack from './lib/components/BrowserTrack.jsx'

import { parseJson, getTheme } from './lib/utils.js'
import { getSettings } from './lib/settings.js'

import { styles } from './lib/styles/Styles.js'

const refreshFrequency = 10000

const theme = getTheme()
const Styles = styles[theme]

const settings = getSettings()

const className = `
  ${Styles.BaseStyles}
  ${Styles.DateStyles}
  ${Styles.TimeStyles}
  ${Styles.BatteryStyles}
  ${Styles.WifiStyles}
  ${Styles.MicStyles}
  ${Styles.SoundStyles}
  ${Styles.SpotifyStyles}
  ${Styles.BrowserTrackStyles}
  ${Styles.SpecterStyles}

  ${settings.global.floatingBar ? Styles.FloatingBarOverride : ''}
  ${settings.global.noColorInData ? Styles.NoColorInDataOverride : ''}
  ${settings.global.noBarBg ? Styles.NoBarBgOverride : ''}
  ${settings.global.bottomBar ? Styles.BottomBarOverride : ''}
  ${settings.global.floatingBar && settings.global.bottomBar ? Styles.FloatinBottomBarOverride : ''}
`

const command = 'bash simple-bar/lib/scripts/get_data.sh'

const render = ({ output, error }) => {
  if (error) {
    return (
      <div className="simple-bar simple-bar--data simple-bar--empty">
        <span>simple-bar-data.jsx: Something went wrong...</span>
      </div>
    )
  }
  if (!output) {
    return (
      <div className="simple-bar simple-bar--data simple-bar--loading simple-bar--empty">
        <span>simple-bar-data.jsx: Loading...</span>
      </div>
    )
  }
  const data = parseJson(output)
  if (!data) {
    return (
      <div className="simple-bar simple-bar--data simple-bar--empty">
        <span>simple-bar-data.jsx: JSON error...</span>
      </div>
    )
  }
  const { battery, wifi, mic, sound, spotify, browserTrack } = data
  return (
    <div className="simple-bar simple-bar--data">
      <BrowserTrack output={{ ...browserTrack, spotifyStatus: spotify.spotifyIsRunning }} />
      <Spotify output={spotify} />
      <Battery output={battery} />
      <Mic output={mic} />
      <Sound output={sound} />
      <Wifi output={wifi} />
      <DateDisplay />
      <Time />
    </div>
  )
}

export { command, refreshFrequency, className, render }
