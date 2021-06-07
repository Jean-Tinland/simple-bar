import { React, run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import Specter from './Specter.jsx'
import { PlayingIcon, PausedIcon } from '../icons.jsx'

import { refreshData, clickEffect, classnames, startSliding, stopSliding } from '../../utils'
import { getSettings } from '../../settings'

export { musicStyles } from '../../styles/components/data/music'

const { useRef } = React

const togglePlay = async (isPaused, processName) => {
  if (isPaused) {
    await run(`osascript -e 'tell application "${processName}" to play'`)
    await refreshData()
  } else {
    await run(`osascript -e 'tell application "${processName}" to pause'`)
    await refreshData()
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
  if (musicIsRunning === 'false' || !trackName.length) return null

  const isPlaying = playerState === 'playing'
  const Icon = isPlaying ? PlayingIcon : PausedIcon

  const onClick = async (e) => {
    clickEffect(e)
    await togglePlay(!isPlaying, processName)
  }
  const onMouseEnter = () => startSliding(ref.current, '.music__inner', '.music__slider')
  const onMouseLeave = () => stopSliding(ref.current, '.music__slider')

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
