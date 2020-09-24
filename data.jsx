import Time from './lib/components/Time.jsx'
import DateDisplay from './lib/components/Date.jsx'
import Battery from './lib/components/Battery.jsx'
import Sound from './lib/components/Sound.jsx'
import Wifi from './lib/components/Wifi.jsx'
import Spotify from './lib/components/Spotify.jsx'
import BrowserTrack from './lib/components/BrowserTrack.jsx'

import { parseJson } from './lib/utils.js'

import {
  DateStyles,
  TimeStyles,
  BatteryStyles,
  WifiStyles,
  SoundStyles,
  SpotifyStyles,
  BrowserTrackStyles,
  SpecterStyles
} from './lib/styles/Styles.js'
import { Theme } from './lib/styles/Theme.js'

const refreshFrequency = 10000

const className = /* css */ `
  .simple-bar__error,
  .simple-bar__data {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    margin-left: auto;
    padding: 4px 5px;
    color: ${Theme.main};
    font-family: ${Theme.font};
    font-size: 11px;
    z-index: 1;
  }
  .simple-bar__data > *:not(:last-of-type) {
    margin-right: 5px;
  }
  ${DateStyles}
  ${TimeStyles}
  ${BatteryStyles}
  ${WifiStyles}
  ${SoundStyles}
  ${SpotifyStyles}
  ${BrowserTrackStyles}
  ${SpecterStyles}
`

const command = 'bash simple-bar/lib/scripts/get_data.sh'

const render = ({ output, error }) => {
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>
  const data = parseJson(output)
  if (!data) return <div className="simple-bar__error">JSON error...</div>
  const { battery, wifi, sound, spotify, browserTrack } = data
  return (
    <div className="simple-bar__data">
      <BrowserTrack output={browserTrack} spotifyStatus={spotify.spotifyIsRunning} />
      <Spotify output={spotify} />
      <Battery output={battery} />
      <Sound output={sound} />
      <Wifi output={wifi} />
      <DateDisplay />
      <Time />
    </div>
  )
}

export { command, refreshFrequency, className, render }
