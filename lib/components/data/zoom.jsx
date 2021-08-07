import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Settings from '../../settings'
import * as Utils from '../../utils'

export { zoomStyles as styles } from '../../styles/components/data/zoom'

const refreshFrequency = 20000

const settings = Settings.get()

export const Widget = () => {
  const { widgets, zoomWidgetOptions } = settings
  const { zoomWidget } = widgets
  const { showVideo, showMic } = zoomWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(zoomWidget)

  const getZoom = async () => {
    const [mic, video] = await Promise.all([
      Uebersicht.run(`osascript ./simple-bar/lib/scripts/zoom-mute-status.applescript`),
      Uebersicht.run(`osascript ./simple-bar/lib/scripts/zoom-video-status.applescript`)
    ])
    setState({ mic: Utils.cleanupOutput(mic), video: Utils.cleanupOutput(video) })
    setLoading(false)
  }

  useWidgetRefresh(zoomWidget, getZoom, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="zoom" />
  if (!state || (!state.mic.length && !state.video.length)) return null

  const { mic, video } = state
  const MicIcon = mic === 'off' ? Icons.MicOff : Icons.MicOn
  return (
    <DataWidget.Widget classes="zoom">
      {showVideo && <Icons.Zoom className={`zoom__icon zoom__icon--${video}`} />}
      {showMic && <MicIcon className={`zoom__icon zoom__icon--${mic}`} />}
    </DataWidget.Widget>
  )
}
