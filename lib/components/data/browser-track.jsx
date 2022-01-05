import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { browserTrackStyles as styles } from '../../styles/components/data/browser-track'

const settings = Settings.get()
const { widgets, browserTrackWidgetOptions } = settings
const { browserTrackWidget } = widgets
const { refreshFrequency, showSpecter } = browserTrackWidgetOptions

const DEFAULT_REFRESH_FREQUENCY = 10000
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY)

const getIcon = (browser) => {
  if (browser === 'chrome') return Icons.GoogleChrome
  if (browser === 'brave') return Icons.BraveBrowser
  if (browser === 'safari') return Icons.Safari
  if (browser === 'firefox') return Icons.Firefox
  return Icons.Default
}

export const Widget = () => {
  const ref = Uebersicht.React.useRef()

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(browserTrackWidget)

  const getBrowserTrack = async () => {
    const [firefoxStatus, firefoxDevStatus] = await Promise.all([
      Uebersicht.run(`ps aux | grep -v 'grep' | grep -q 'Firefox' && echo "true" || echo "false"`),
      Uebersicht.run(`ps aux | grep -v 'grep' | grep -q 'Firefox Developer Edition' && echo "true" || echo "false"`)
    ])
    const isFirefoxDevRunning = Utils.cleanupOutput(firefoxDevStatus) === 'true'
    const isFirefoxRunning = Utils.cleanupOutput(firefoxStatus) === 'true'
    const browser = isFirefoxDevRunning ? 'firefox-dev' : isFirefoxRunning ? 'firefox' : 'browser'
    const [browserTrackOutput, spotifyStatus] = await Promise.all([
      Uebersicht.run(`osascript ./simple-bar/lib/scripts/${browser}-audio.applescript 2>&1`),
      Uebersicht.run(`ps aux | grep -v 'grep' | grep -q '[S]potify Helper' && echo "true" || echo "false"`)
    ])
    const browserTrack = JSON.parse(browserTrackOutput)
    setState({
      ...browserTrack,
      isSpotifyRunning: Utils.cleanupOutput(spotifyStatus) === 'true'
    })
    setLoading(false)
  }

  useWidgetRefresh(browserTrackWidget, getBrowserTrack, REFRESH_FREQUENCY)

  if (loading) return <DataWidgetLoader.Widget className="browser-track" />
  if (!state) return null
  const { browser, title, isSpotifyRunning } = state

  if (!browser?.length || !title?.length || isSpotifyRunning) return null

  const Icon = () => {
    const BrowserIcon = getIcon(browser)
    return (
      <div className="browser-track__icons">
        <BrowserIcon />
        <Icons.Playing />
      </div>
    )
  }

  return (
    <DataWidget.Widget ref={ref} classes="browser-track" Icon={Icon} showSpecter={showSpecter}>
      {title}
    </DataWidget.Widget>
  )
}
