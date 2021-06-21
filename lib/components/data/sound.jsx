import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { VolumeHighIcon, VolumeLowIcon, NoVolumeIcon, VolumeMutedIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'
import { getSettings } from '../../settings'
import { classnames, cleanupOutput } from '../../utils.js'

export { soundStyles } from '../../styles/components/data/sound'

const { useEffect, useState } = React

const refreshFrequency = 20000

const getIcon = (volume, muted) => {
  if (muted === 'true' || !volume) return VolumeMutedIcon
  if (volume < 20) return NoVolumeIcon
  if (volume < 50) return VolumeLowIcon
  return VolumeHighIcon
}

const setSound = (volume) => {
  if (!volume) return
  run(`osascript -e 'set volume output volume ${volume}'`)
}

const Sound = () => {
  const settings = getSettings()
  const { soundWidget } = settings.widgets

  const [state, setState] = useState()
  const [loading, setLoading] = useState(soundWidget)
  const { volume: _volume } = state || {}
  const [volume, setVolume] = useState(_volume && parseInt(_volume))
  const [dragging, setDragging] = useState(false)

  const getSound = async () => {
    const [volume, muted] = await Promise.all([
      run(`osascript -e 'set ovol to output volume of (get volume settings)'`),
      run(`osascript -e 'set ovol to output muted of (get volume settings)'`)
    ])
    setState({ volume: cleanupOutput(volume), muted: cleanupOutput(muted) })
    setLoading(false)
  }

  useWidgetRefresh(soundWidget, getSound, refreshFrequency)

  useEffect(() => {
    if (!dragging) setSound(volume)
  }, [loading])

  useEffect(() => {
    if (_volume && parseInt(_volume) !== volume) {
      setVolume(parseInt(_volume))
    }
  }, [_volume])

  if (loading) return <DataWidgetLoader className="sound" />
  if (!state || volume === undefined) return null

  const { muted } = state
  if (_volume === 'missing value' || muted === 'missing value') return null

  const Icon = getIcon(volume, muted)

  const onChange = (e) => {
    const value = parseInt(e.target.value)
    setVolume(value)
  }
  const onMouseDown = () => setDragging(true)
  const onMouseUp = () => setDragging(false)

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
