import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { MicOnIcon, MicOffIcon } from '../icons.jsx'
import { getSettings } from '../../settings'
import { classnames, cleanupOutput } from '../../utils.js'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'

export { micStyles } from '../../styles/components/data/mic'

const { useEffect, useState } = React

const refreshFrequency = 20000

const setMic = (volume) => {
  if (volume === undefined) return
  run(`osascript -e 'set volume input volume ${volume}'`)
}

const settings = getSettings()

const Mic = () => {
  const { micWidget } = settings.widgets

  const [state, setState] = useState()
  const [loading, setLoading] = useState(micWidget)
  const { volume: _volume } = state || {}
  const [volume, setVolume] = useState(_volume && parseInt(_volume))
  const [dragging, setDragging] = useState(false)

  const getMic = async () => {
    const volume = await run(`osascript -e 'set ovol to input volume of (get volume settings)'`)
    setState({ volume: cleanupOutput(volume) })
    setLoading(false)
  }

  useWidgetRefresh(micWidget, getMic, refreshFrequency)

  useEffect(() => {
    if (!dragging) setMic(volume)
  }, [dragging])

  useEffect(() => {
    if (_volume && parseInt(_volume) !== volume) {
      setVolume(parseInt(_volume))
    }
  }, [_volume])

  if (loading) return <DataWidgetLoader className="mic" />
  if (!state || volume === undefined || _volume === 'missing value') return null

  const Icon = !volume ? MicOffIcon : MicOnIcon

  const onChange = (e) => {
    const value = parseInt(e.target.value)
    setVolume(value)
  }
  const onMouseDown = () => setDragging(true)
  const onMouseUp = () => setDragging(false)

  const fillerWidth = !volume ? volume : volume / 100 + 0.05

  const classes = classnames('mic', {
    'mic--dragging': dragging
  })

  return (
    <DataWidget classes={classes}>
      <div className="mic__display">
        <Icon />
        <span className="mic__value">{volume}%</span>
      </div>
      <div className="mic__slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          className="mic__slider"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
        <div className="mic__slider-filler" style={{ transform: `scaleX(${fillerWidth})` }} />
      </div>
    </DataWidget>
  )
}

export default Mic
