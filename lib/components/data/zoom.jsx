import { run, React } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { ZoomIcon, MicOnIcon, MicOffIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh'
import { getSettings } from '../../settings'
import { cleanupOutput } from '../../utils.js'

export { zoomStyles } from '../../styles/components/data/zoom'

const { useState } = React

const refreshFrequency = 20000

const Zoom = () => {
  const settings = getSettings()
  const { widgets, zoomWidgetOptions } = settings
  const { zoomWidget } = widgets
  const { showVideo, showMic } = zoomWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(zoomWidget)

  const getZoom = async () => {
    const [mic, video] = await Promise.all([
      run(`osascript ./simple-bar/lib/scripts/zoom-mute-status.applescript`),
      run(`osascript ./simple-bar/lib/scripts/zoom-video-status.applescript`)
    ])
    setState({ mic: cleanupOutput(mic), video: cleanupOutput(video) })
    setLoading(false)
  }

  useWidgetRefresh(zoomWidget, getZoom, refreshFrequency)

  if (loading) return <DataWidgetLoader className="zoom" />
  if (!state || (!state.mic.length && !state.video.length)) return null

  const { mic, video } = state
  const MicIcon = mic === 'off' ? MicOffIcon : MicOnIcon
  return (
    <DataWidget classes="zoom">
      {showVideo && <ZoomIcon className={`zoom__icon zoom__icon--${video}`} />}
      {showMic && <MicIcon className={`zoom__icon zoom__icon--${mic}`} />}
    </DataWidget>
  )
}

export default Zoom
