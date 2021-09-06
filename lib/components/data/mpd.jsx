import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Specter from './specter.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { mpdStyles as styles } from '../../styles/components/data/mpd'

const refreshFrequency = 1000

const togglePlay = (host, port) => Uebersicht.run(`mpc --host ${host} --port ${port} toggle`)

const setSound = (host, port, volume) => {
  if (!volume) return
  Uebersicht.run(`mpc --host ${host} --port ${port} volume ${lin2LogVolume(volume)}`)
}

const lin2LogVolume = (position) => {
  // position will be between 0 and 100
  const minp = 0
  const maxp = 100

  // The result should be between 0 an 100
  const minv = Math.log(1)
  const maxv = Math.log(100)

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp)

  if (position === 0) return position
  return Math.round(Math.exp(minv + scale * (position - minp)))
}

const log2LinVolume = (volume) => {
  // volume will be between 0 and 100
  const minp = 0
  const maxp = 100

  // The result should be between 0 an 100
  const minv = Math.log(1)
  const maxv = Math.log(100)

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp)

  if (volume === 0) return volume
  return Math.round((Math.log(volume) - minv) / scale + minp)
}

const settings = Settings.get()

export const Widget = () => {
  const ref = Uebersicht.React.useRef()
  const { widgets, mpdWidgetOptions } = settings
  const { mpdWidget } = widgets
  const { showSpecter, mpdHost, mpdPort, mpdFormatString } = mpdWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(mpdWidget)
  const { volume: _volume } = state || {}
  const [volume, setVolume] = Uebersicht.React.useState(_volume && parseInt(_volume))
  const [dragging, setDragging] = Uebersicht.React.useState(false)

  const getMpd = async () => {
    try {
      const [playerState, trackInfo, volumeState] = await Promise.all([
        Uebersicht.run(
          `mpc --host ${mpdHost} --port ${mpdPort} | head -n 2 | tail -n 1 | awk '{print substr($1,2,length($1)-2)}' 2>/dev/null || echo "stopped"`
        ),
        Uebersicht.run(`mpc --host ${mpdHost} --port ${mpdPort} --format "${mpdFormatString}" | head -n 1`),
        Uebersicht.run(`mpc --host ${mpdHost} --port ${mpdPort} volume | sed -e 's/volume:[ ]*//g' -e 's/%//g'`)
      ])
      if (Utils.cleanupOutput(trackInfo) === '') {
        setLoading(false)
        return
      }
      setState({
        playerState: Utils.cleanupOutput(playerState),
        trackInfo: Utils.cleanupOutput(trackInfo),
        volume: log2LinVolume(Utils.cleanupOutput(volumeState))
      })
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  useWidgetRefresh(mpdWidget, getMpd, refreshFrequency)

  Uebersicht.React.useEffect(() => {
    if (!dragging) setSound(mpdHost, mpdPort, volume)
  }, [dragging])

  Uebersicht.React.useEffect(() => {
    if (_volume && parseInt(_volume) !== volume) {
      setVolume(parseInt(_volume))
    }
  }, [_volume])

  if (loading) return <DataWidgetLoader.Widget className="mpd" />
  if (!state) return null
  const { playerState, trackInfo } = state

  if (!trackInfo.length) return null

  const isPlaying = playerState === 'playing'
  const Icon = isPlaying ? Icons.Playing : Icons.Paused

  const onClick = (e) => {
    Utils.clickEffect(e)
    togglePlay(mpdHost, mpdPort)
    getMpd()
  }

  const onChange = (e) => {
    const value = parseInt(e.target.value)
    setVolume(value)
  }
  const onMouseDown = () => setDragging(true)
  const onMouseUp = () => setDragging(false)

  const fillerWidth = !volume ? volume : volume / 100 + 0.05

  const onMouseEnter = () => Utils.startSliding(ref.current, '.mpd__inner', '.mpd__slider')
  const onMouseLeave = () => Utils.stopSliding(ref.current, '.mpd__slider')

  const classes = Utils.classnames('mpd', { 'mpd--playing': isPlaying }, 'sound', { 'sound--dragging': dragging })

  return (
    <DataWidget.Widget ref={ref} classes={classes} Icon={Icon} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {showSpecter && isPlaying && <Specter.Widget />}
      <div className="mpd__inner" onClick={onClick}>
        <div className="mpd__slider">{trackInfo}</div>
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
