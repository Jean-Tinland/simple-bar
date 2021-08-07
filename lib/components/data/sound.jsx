import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Settings from '../../settings'
import * as Utils from '../../utils'

export { soundStyles as styles } from '../../styles/components/data/sound'

const refreshFrequency = 20000

const getIcon = (volume, muted) => {
  if (muted === 'true' || !volume) return Icons.VolumeMuted
  if (volume < 20) return Icons.NoVolume
  if (volume < 50) return Icons.VolumeLow
  return Icons.VolumeHigh
}

const setSound = (volume) => {
  if (volume === undefined) return
  Uebersicht.run(`osascript -e 'set volume output volume ${volume}'`)
}

const settings = Settings.get()

export const Widget = () => {
  const { soundWidget } = settings.widgets

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(soundWidget)
  const { volume: _volume } = state || {}
  const [volume, setVolume] = Uebersicht.React.useState(_volume && parseInt(_volume))
  const [dragging, setDragging] = Uebersicht.React.useState(false)

  const getSound = async () => {
    const [volume, muted] = await Promise.all([
      Uebersicht.run(`osascript -e 'set ovol to output volume of (get volume settings)'`),
      Uebersicht.run(`osascript -e 'set ovol to output muted of (get volume settings)'`)
    ])
    setState({ volume: Utils.cleanupOutput(volume), muted: Utils.cleanupOutput(muted) })
    setLoading(false)
  }

  useWidgetRefresh(soundWidget, getSound, refreshFrequency)

  Uebersicht.React.useEffect(() => {
    if (!dragging) setSound(volume)
  }, [dragging])

  Uebersicht.React.useEffect(() => {
    if (_volume && parseInt(_volume) !== volume) {
      setVolume(parseInt(_volume))
    }
  }, [_volume])

  if (loading) return <DataWidgetLoader.Widget className="sound" />
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

  const classes = Utils.classnames('sound', { 'sound--dragging': dragging })

  return (
    <DataWidget.Widget classes={classes}>
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
    </DataWidget.Widget>
  )
}
