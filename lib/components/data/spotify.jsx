import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import Specter from './specter.jsx'
import { PlayingIcon, PausedIcon, StoppedIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh'
import { clickEffect, classnames, startSliding, stopSliding, cleanupOutput } from '../../utils'
import { getSettings } from '../../settings'

export { spotifyStyles } from '../../styles/components/data/spotify'

const { useRef, useState } = React

const refreshFrequency = 10000

const togglePlay = (isPaused) => {
  const state = isPaused ? 'play' : 'pause'
  run(`osascript -e 'tell application "Spotify" to ${state}'`)
}

const getIcon = (playerState) => {
  if (playerState === 'stopped') return StoppedIcon
  if (playerState === 'playing') return PlayingIcon
  return PausedIcon
}

const settings = getSettings()

const Spotify = () => {
  const ref = useRef()
  const { widgets, spotifyWidgetOptions } = settings
  const { spotifyWidget } = widgets

  const [state, setState] = useState()
  const [loading, setLoading] = useState(spotifyWidget)

  const getSpotify = async () => {
    const isRunning = await run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "Spotify"' 2>&1`
    )
    if (cleanupOutput(isRunning) === 'false') {
      setLoading(false)
      return
    }
    const [playerState, trackName, artistName] = await Promise.all([
      run(`osascript -e 'tell application "Spotify" to player state as string' 2>/dev/null || echo "stopped"`),
      run(
        `osascript -e 'tell application "Spotify" to name of current track as string' 2>/dev/null || echo "unknown track"`
      ),
      run(
        `osascript -e 'tell application "Spotify" to artist of current track as string' 2>/dev/null || echo "unknown artist"`
      )
    ])
    setState({
      playerState: cleanupOutput(playerState),
      trackName: cleanupOutput(trackName),
      artistName: cleanupOutput(artistName)
    })
    setLoading(false)
  }

  useWidgetRefresh(spotifyWidget, getSpotify, refreshFrequency)

  if (loading) return <DataWidgetLoader className="spotify" />
  if (!state) return null
  const { playerState, trackName, artistName } = state
  const { showSpecter } = spotifyWidgetOptions

  if (!trackName.length) return null

  const label = artistName.length ? `${trackName} - ${artistName}` : trackName
  const isPlaying = playerState === 'playing'
  const Icon = getIcon(playerState)

  const onClick = (e) => {
    clickEffect(e)
    togglePlay(!isPlaying)
    getSpotify()
  }
  const onMouseEnter = () => startSliding(ref.current, '.spotify__inner', '.spotify__slider')
  const onMouseLeave = () => stopSliding(ref.current, '.spotify__slider')

  const classes = classnames('spotify', {
    'spotify--playing': isPlaying
  })

  return (
    <DataWidget
      ref={ref}
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSpecter && isPlaying && <Specter />}
      <div className="spotify__inner">
        <div className="spotify__slider">{label}</div>
      </div>
    </DataWidget>
  )
}

export default Spotify
