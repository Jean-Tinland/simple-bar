import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Specter from './specter.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { browserTrackStyles as styles } from '../../styles/components/data/browser-track'

const refreshFrequency = 10000

const getIcon = (browser) => {
  if (browser === 'chrome') return Icons.GoogleChrome
  if (browser === 'safari') return Icons.Safari
  if (browser === 'firefox') return Icons.Firefox
  return Icons.Default
}

const settings = Settings.get()

export const Widget = () => {
  const ref = Uebersicht.React.useRef()
  const { widgets, browserTrackWidgetOptions } = settings
  const { browserTrackWidget } = widgets
  const { showSpecter } = browserTrackWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(browserTrackWidget)

  const getBrowserTrack = async () => {
    const [browserTrackOutput, spotifyStatus] = await Promise.all([
      Uebersicht.run(`osascript ./simple-bar/lib/scripts/browser-audio.applescript 2>&1`),
      Uebersicht.run(`osascript -e 'tell application "System Events" to (name of processes) contains "Spotify"' 2>&1`)
    ])
    const browserTrack = JSON.parse(browserTrackOutput)
    setState({
      ...browserTrack,
      isSpotifyRunning: Utils.cleanupOutput(spotifyStatus) === 'true'
    })
    setLoading(false)
  }

  useWidgetRefresh(browserTrackWidget, getBrowserTrack, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="browser-track" />
  if (!state) return null
  const { browser, title, isSpotifyRunning } = state

  if (!browser?.length || !title?.length || isSpotifyRunning) return null

  const onMouseEnter = () => Utils.startSliding(ref.current, '.browser-track__inner', '.browser-track__slider')
  const onMouseLeave = () => Utils.stopSliding(ref.current, '.browser-track__slider')

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
    <DataWidget.Widget
      ref={ref}
      classes="browser-track"
      Icon={Icon}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSpecter && <Specter.Widget />}
      <div className="browser-track__inner">
        <div className="browser-track__slider">{title}</div>
      </div>
    </DataWidget.Widget>
  )
}
