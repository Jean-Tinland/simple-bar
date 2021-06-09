import { run, React } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { VolumeHighIcon, VolumeLowIcon, NoVolumeIcon, VolumeMutedIcon } from '../icons.jsx'

import { getSettings } from '../../settings'
import { classnames, refreshData } from '../../utils.js'

export { soundStyles } from '../../styles/components/data/sound'

const { useEffect, useState } = React

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
  const [dragging, setDragging] = useState(false)
  if (!soundWidget || !output) return null

  if (volume === 'missing value' || muted === 'missing value') return null

  const Icon = getIcon(volume, muted)

  const onChange = (e) => {
    const value = parseInt(e.target.value)
    setVolume(value)
  }
  const onMouseDown = () => setDragging(true)
  const onMouseUp = () => setDragging(false)

  useEffect(() => {
    if (!dragging) setSound(volume)
  }, [dragging])

  useEffect(() => {
    if (_volume && parseInt(_volume) !== volume) {
      setVolume(parseInt(_volume))
    }
  }, [_volume])

  const fillerWidth = !volume ? volume : volume / 100 + 0.05

  const classes = classnames('sound', {
    'sound--dragging': dragging
  })

  return (
    <DataWidget classes={classes}>
      <div className="sound__display">
        <Icon />
        <span className="sound__value">{volume}%</span>
      </div>
      <div className="sound__slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          className="sound__slider"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
        <div className="sound__slider-filler" style={{ transform: `scaleX(${fillerWidth})` }} />
      </div>
    </DataWidget>
  )
}

export default Sound
