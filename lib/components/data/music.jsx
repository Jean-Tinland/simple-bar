import { React, run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import Specter from './Specter.jsx'
import { PlayingIcon, PausedIcon } from '../icons.jsx'

import { refreshData, clickEffect, classnames } from '../../utils'
import { getSettings } from '../../settings'

export { musicStyles } from '../../styles/components/data/music'

const { useRef } = React

const togglePlay = (isPaused, processName) => {
  if (isPaused) {
    run(`osascript -e 'tell application "${processName}" to play'`).then(refreshData)
  } else {
    run(`osascript -e 'tell application "${processName}" to pause'`).then(refreshData)
  }
}

const Spotify = ({ output }) => {
  const ref = useRef()
  const settings = getSettings()
  const { widgets, musicWidgetOptions } = settings
  const { musicWidget } = widgets
  if (!musicWidget || !output) return null
  const { processName, playerState, trackName, artistName, musicIsRunning } = output
  const { showSpecter } = musicWidgetOptions
  if (musicIsRunning === 'false' || trackName === '') return null

  const isPlaying = playerState === 'playing'
  const Icon = isPlaying ? PlayingIcon : PausedIcon

  const onClick = (e) => {
    clickEffect(e)
    togglePlay(!isPlaying, processName)
  }
  const onMouseEnter = () => {
    const target = ref.current
    if (!target) return
    const inner = target.querySelector('.music__inner')
    const slider = target.querySelector('.music__slider')
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
    target && target.querySelector('.music__slider').removeAttribute('style')
  }

  const classes = classnames('music', {
    'music--playing': isPlaying
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
      <div className="music__inner">
        <div className="music__slider">
          {trackName} - {artistName}
        </div>
      </div>
    </DataWidget>
  )
}

export default Spotify
