import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'

import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { spotifyStyles as styles } from '../../styles/components/data/spotify'

const settings = Settings.get()
const { widgets, spotifyWidgetOptions } = settings
const { spotifyWidget } = widgets
const { refreshFrequency, showSpecter } = spotifyWidgetOptions

const DEFAULT_REFRESH_FREQUENCY = 10000
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY)

const togglePlay = (isPaused) => {
  const state = isPaused ? 'play' : 'pause'
  Uebersicht.run(`osascript -e 'tell application "Spotify" to ${state}'`)
}

const getIcon = (playerState) => {
  if (playerState === 'stopped') return Icons.Stopped
  if (playerState === 'playing') return Icons.Playing
  return Icons.Paused
}

export const Widget = () => {
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(spotifyWidget)

  const getSpotify = async () => {
    const isRunning = await Uebersicht.run(
      `ps aux | grep -v 'grep' | grep -q '[S]potify Helper' && echo "true" || echo "false"`
    )
    if (Utils.cleanupOutput(isRunning) === 'false') {
      setLoading(false)
      setState({
        playerState: '',
        trackName: '',
        artistName: ''
      })
      return
    }
    const [playerState, trackName, artistName] = await Promise.all([
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to player state as string' 2>/dev/null || echo "stopped"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to name of current track as string' 2>/dev/null || echo "unknown track"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to artist of current track as string' 2>/dev/null || echo "unknown artist"`
      )
    ])
    setState({
      playerState: Utils.cleanupOutput(playerState),
      trackName: Utils.cleanupOutput(trackName),
      artistName: Utils.cleanupOutput(artistName)
    })
    setLoading(false)
  }

  useWidgetRefresh(spotifyWidget, getSpotify, REFRESH_FREQUENCY)

  if (loading) return <DataWidgetLoader.Widget className="spotify" />
  if (!state) return null
  const { playerState, trackName, artistName } = state

  if (!trackName.length) return null

  const label = artistName.length ? `${trackName} - ${artistName}` : trackName
  const isPlaying = playerState === 'playing'
  const Icon = getIcon(playerState)

  const onClick = (e) => {
    Utils.clickEffect(e)
    togglePlay(!isPlaying)
    getSpotify()
  }
  const onRightClick = (e) => {
    Utils.clickEffect(e)
    Uebersicht.run(`osascript -e 'tell application "Spotify" to Next Track'`)
    getSpotify()
  }
  const onMiddleClick = (e) => {
    Utils.clickEffect(e)
    Uebersicht.run(`open -a 'Spotify'`)
    getSpotify()
  }

  const classes = Utils.classnames('spotify', { 'spotify--playing': isPlaying })

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      onRightClick={onRightClick}
      onMiddleClick={onMiddleClick}
      showSpecter={showSpecter && isPlaying}
    >
      {label}
    </DataWidget.Widget>
  )
}
