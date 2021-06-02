import { React, run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import Specter from './specter.jsx'
import { PlayingIcon, PausedIcon, StoppedIcon } from '../icons.jsx'

import { refreshData, clickEffect, classnames } from '../../utils'
import { getSettings } from '../../settings'

export { spotifyStyles } from '../../styles/components/data/spotify'

const { useRef } = React

const togglePlay = (isPaused) => {
  if (isPaused) {
    run(`osascript -e 'tell application "Spotify" to play'`).then(refreshData)
  } else {
    run(`osascript -e 'tell application "Spotify" to pause'`).then(refreshData)
  }
}

const getIcon = (playerState) => {
  if (playerState === 'stopped') return StoppedIcon
  if (playerState === 'playing') return PlayingIcon
  return PausedIcon
}

const Spotify = ({ output }) => {
  const ref = useRef()
  const settings = getSettings()
  const { widgets, spotifyWidgetOptions } = settings
  const { spotifyWidget } = widgets

  if (!spotifyWidget || !output) return null
  const { playerState, trackName, artistName, spotifyIsRunning } = output
  const { showSpecter } = spotifyWidgetOptions

  if (spotifyIsRunning === 'false' || !trackName.length) return null

  const label = artistName.length ? `${trackName} - ${artistName}` : trackName
  const isPlaying = playerState === 'playing'
  const Icon = getIcon(playerState)

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
        <div className="spotify__slider">
          {trackName} - {artistName}
        </div>
      </div>
    </DataWidget>
  )
}

export default Spotify
