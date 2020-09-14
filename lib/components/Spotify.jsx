import { run } from 'uebersicht'

import { PlayingIcon, PausedIcon } from './Icons.jsx'
import { refreshData, clickEffect, classnames } from '../utils'

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

  const onClick = (e) => {
    clickEffect(e)
    togglePlay(!isPlaying)
  }
  const onMouseEnter = (e) => {
    const target = e.target.closest('.spotify')
    if (!target) return
    const inner = target.querySelector('.spotify__inner')
    const slider = target.querySelector('.spotify__slider')
    const delta = inner.clientWidth - slider.clientWidth
    if (delta > 0) return
    const timing = Math.round((Math.abs(delta) * 100) / 4)
    Object.assign(slider.style, {
      transform: `translateX(${delta}px)`,
      transition: `transform ${timing}ms linear`
    })
  }
  const onMouseLeave = (e) => {
    const target = e.target.closest('.spotify')
    target && target.querySelector('.spotify__slider').removeAttribute('style')
  }

  const classes = classnames('spotify', {
    'spotify--playing': isPlaying
  })

  return (
    <div className={classes} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Icon className="spotify__icon" />
      <div className="spotify__specter">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="spotify__inner">
        <div className="spotify__slider">
          {trackName} - {artistName}
        </div>
      </div>
    </div>
  )
}

export default Spotify
