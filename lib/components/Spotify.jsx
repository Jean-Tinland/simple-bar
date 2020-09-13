import { run } from 'uebersicht'

import { PlayingIcon, PausedIcon } from './Icons.jsx'
import { refreshData, clickEffect, truncate } from '../utils'

const togglePlay = (isPaused) => {
  if (isPaused) {
    run(`osascript -e 'tell application "Spotify" to play'`).then(refreshData)
  } else {
    run(`osascript -e 'tell application "Spotify" to pause'`).then(refreshData)
  }
}

const Spotify = ({ output }) => {
  if (!output) return null
  const { playerState, trackName, artistName, spotifyIsRunning } = output
  if (spotifyIsRunning === 'false') return null

  const isPlaying = playerState === 'playing'
  const Icon = isPlaying ? PlayingIcon : PausedIcon

  const clicked = (e) => {
    clickEffect(e)
    togglePlay(!isPlaying)
  }

  return (
    <div className="spotify" onClick={clicked}>
      <Icon className="spotify__icon" />
      {truncate(trackName, 16)} - {truncate(artistName, 16)}
    </div>
  )
}

export default Spotify
