import { run, React } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { VolumeHighIcon, VolumeLowIcon, NoVolumeIcon, VolumeMutedIcon } from '../icons.jsx'

import { getSettings } from '../../settings'
import { refreshData } from '../../utils.js'

export { soundStyles } from '../../styles/components/data/sound'

const { useState } = React

const getIcon = (volume, muted) => {
  if (muted === 'true' || !volume) return VolumeMutedIcon
  if (volume < 20) return NoVolumeIcon
  if (volume < 50) return VolumeLowIcon
  return VolumeHighIcon
}

const setSound = (volume) => run(`osascript -e 'set volume output volume ${volume}'`).then(refreshData)

const Sound = ({ output }) => {
  const settings = getSettings()
  const { soundWidget } = settings.widgets
  const { volume: _volume, muted } = output || {}
  const [volume, setVolume] = useState(_volume && parseInt(_volume))
  if (!soundWidget || !output) return null

  if (volume === 'missing value' || muted === 'missing value') return null

  const Icon = getIcon(volume, muted)

  const onChange = (e) => {
    const value = parseInt(e.target.value)
    setVolume(value)
    setSound(value)
  }

  const fillerWidth = volume / 100

  return (
    <DataWidget classes="sound">
      <div className="sound__slider-container">
        <input type="range" min="0" max="100" step="10" value={volume} className="sound__slider" onChange={onChange} />
        <div className="sound__slider-filler" style={{ transform: `scaleX(${fillerWidth})` }} />
      </div>
      <button className="sound__toggle">
        <Icon />
        <span className="sound__value">{volume}%</span>
      </button>
    </DataWidget>
  )
}

export default Sound
