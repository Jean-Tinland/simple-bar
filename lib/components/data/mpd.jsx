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

const settings = Settings.get()

export const Widget = () => {
  const ref = Uebersicht.React.useRef()
  const { widgets, mpdWidgetOptions } = settings
  const { mpdWidget } = widgets
  const { showSpecter, mpdHost, mpdPort, mpdFormatString } = mpdWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(mpdWidget)

  const getMpd = async () => {
    try {
      const [playerState, trackInfo] = await Promise.all([
        Uebersicht.run(
          `mpc --host ${mpdHost} --port ${mpdPort} | head -n 2 | tail -n 1 | awk '{print substr($1,2,length($1)-2)}' 2>/dev/null`
        ),
        Uebersicht.run(`mpc --host ${mpdHost} --port ${mpdPort} --format "${mpdFormatString}" | head -n 1`)
      ])
      if (Utils.cleanupOutput(trackInfo) === '') {
        setLoading(false)
        return
      }
      setState({
        playerState: Utils.cleanupOutput(playerState),
        trackInfo: Utils.cleanupOutput(trackInfo)
      })
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  useWidgetRefresh(mpdWidget, getMpd, refreshFrequency)

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
  const onMouseEnter = () => Utils.startSliding(ref.current, '.mpd__inner', '.mpd__slider')
  const onMouseLeave = () => Utils.stopSliding(ref.current, '.mpd__slider')

  const classes = Utils.classnames('mpd', { 'mpd--playing': isPlaying })

  return (
    <DataWidget.Widget
      ref={ref}
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSpecter && isPlaying && <Specter.Widget />}
      <div className="mpd__inner">
        <div className="mpd__slider">{trackInfo}</div>
      </div>
    </DataWidget.Widget>
  )
}
