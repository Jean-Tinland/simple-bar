import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import Specter from './specter.jsx'
import { GoogleChromeIcon, SafariIcon, PlayingIcon, FirefoxIcon, DefaultIcon } from '../icons.jsx'
import { getSettings } from '../../settings'
import { cleanupOutput, startSliding, stopSliding } from '../../utils.js'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'

export { browserTrackStyles } from '../../styles/components/data/browser-track'

const { useRef, useState } = React

const refreshFrequency = 10000

const getIcon = (browser) => {
  if (browser === 'chrome') return GoogleChromeIcon
  if (browser === 'safari') return SafariIcon
  if (browser === 'firefox') return FirefoxIcon
  return DefaultIcon
}

const BrowserTrack = () => {
  const ref = useRef()
  const settings = getSettings()
  const { widgets, browserTrackWidgetOptions } = settings
  const { browserTrackWidget } = widgets
  const { showSpecter } = browserTrackWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(browserTrackWidget)

  const getBrowserTrack = async () => {
    const [browserTrackOutput, spotifyStatus] = await Promise.all([
      run(`osascript ./simple-bar/lib/scripts/browser-audio.applescript 2>&1`),
      run(`osascript -e 'tell application "System Events" to (name of processes) contains "Spotify"' 2>&1`)
    ])
    const browserTrack = JSON.parse(browserTrackOutput)
    setState({
      ...browserTrack,
      isSpotifyRunning: cleanupOutput(spotifyStatus) === 'true'
    })
    setLoading(false)
  }

  useWidgetRefresh(browserTrackWidget, getBrowserTrack, refreshFrequency)

  if (loading) return <DataWidgetLoader className="browser-track" />
  if (!state) return null
  const { browser, title, isSpotifyRunning } = state

  if (!browser?.length || !title?.length || isSpotifyRunning) return null

  const onMouseEnter = () => startSliding(ref.current, '.browser-track__inner', '.browser-track__slider')
  const onMouseLeave = () => stopSliding(ref.current, '.browser-track__slider')

  const Icon = () => {
    const BrowserIcon = getIcon(browser)
    return (
      <div className="browser-track__icons">
        <BrowserIcon />
        <PlayingIcon />
      </div>
    )
  }

  return (
    <DataWidget ref={ref} classes="browser-track" Icon={Icon} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {showSpecter && <Specter />}
      <div className="browser-track__inner">
        <div className="browser-track__slider">{title}</div>
      </div>
    </DataWidget>
  )
}

export default BrowserTrack
