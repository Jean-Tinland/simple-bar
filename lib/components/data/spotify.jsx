import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Specter from './specter.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { spotifyStyles as styles } from '../../styles/components/data/spotify'

const refreshFrequency = 10000

const togglePlay = (isPaused) => {
  const state = isPaused ? 'play' : 'pause'
  Uebersicht.run(`osascript -e 'tell application "Spotify" to ${state}'`)
}

const getIcon = (playerState) => {
  if (playerState === 'stopped') return Icons.Stopped
  if (playerState === 'playing') return Icons.Playing
  return Icons.Paused
}

const settings = Settings.get()

export const Widget = () => {
  const ref = Uebersicht.React.useRef()
  const { widgets, spotifyWidgetOptions } = settings
  const { spotifyWidget } = widgets

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(spotifyWidget)

  const getSpotify = async () => {
    const isRunning = await Uebersicht.run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "Spotify"' 2>&1`
    )
    if (Utils.cleanupOutput(isRunning) === 'false') {
      setLoading(false)
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

  useWidgetRefresh(spotifyWidget, getSpotify, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="spotify" />
  if (!state) return null
  const { playerState, trackName, artistName } = state
  const { showSpecter } = spotifyWidgetOptions

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

  const onMouseEnter = () => Utils.startSliding(ref.current, '.spotify__inner', '.spotify__slider')
  const onMouseLeave = () => Utils.stopSliding(ref.current, '.spotify__slider')

  const classes = Utils.classnames('spotify', { 'spotify--playing': isPlaying })

  return (
    <DataWidget.Widget
      ref={ref}
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      onRightClick={onRightClick}
      onMiddleClick={onMiddleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSpecter && isPlaying && <Specter.Widget />}
      <div className="spotify__inner">
        <div className="spotify__slider">{label}</div>
      </div>
    </DataWidget.Widget>
  )
}
