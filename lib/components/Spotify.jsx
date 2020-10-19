import { React, run } from 'uebersicht'
import Specter from './Specter.jsx'
import { PlayingIcon, PausedIcon } from './Icons.jsx'

import { refreshData, clickEffect, classnames } from '../utils'

import { getSettings } from '../settings.js'

const { useRef } = React

const togglePlay = (isPaused) => {
  if (isPaused) {
    run(`osascript -e 'tell application "Spotify" to play'`).then(refreshData)
  } else {
    run(`osascript -e 'tell application "Spotify" to pause'`).then(refreshData)
  }
}

const Spotify = ({ output }) => {
  const ref = useRef()
  const settings = getSettings()
  const { widgets, spotifyWidgetOptions } = settings
  const { spotifyWidget } = widgets
  if (!spotifyWidget || !output) return null
  const { playerState, trackName, artistName, spotifyIsRunning } = output
  const { showSpecter } = spotifyWidgetOptions
  if (spotifyIsRunning === 'false' || trackName === '' || artistName === '') return null

  const isPlaying = playerState === 'playing'
  const Icon = isPlaying ? PlayingIcon : PausedIcon

  const onClick = (e) => {
    clickEffect(e)
    togglePlay(!isPlaying)
  }
  const onMouseEnter = () => {
    const target = ref.current
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
  const onMouseLeave = () => {
    const target = ref.current
    target && target.querySelector('.spotify__slider').removeAttribute('style')
  }

  const classes = classnames('spotify', {
    'spotify--playing': isPlaying
  })

  return (
    <div ref={ref} className={classes} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Icon className="spotify__icon" />
      {showSpecter && isPlaying && <Specter />}
      <div className="spotify__inner">
        <div className="spotify__slider">
          {trackName} - {artistName}
        </div>
      </div>
    </div>
  )
}

export default Spotify
