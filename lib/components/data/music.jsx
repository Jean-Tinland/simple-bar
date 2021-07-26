import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import Specter from './specter.jsx'
import { PlayingIcon, PausedIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh'
import { clickEffect, classnames, startSliding, stopSliding, cleanupOutput } from '../../utils'
import { getSettings } from '../../settings'

export { musicStyles } from '../../styles/components/data/music'

const { useRef, useState } = React

const refreshFrequency = 10000

const togglePlay = (isPaused, processName) => {
  if (isPaused) {
    run(`osascript -e 'tell application "${processName}" to play'`)
  } else {
    run(`osascript -e 'tell application "${processName}" to pause'`)
  }
}

const settings = getSettings()

const Music = () => {
  const ref = useRef()
  const { widgets, musicWidgetOptions } = settings
  const { musicWidget } = widgets
  const { showSpecter } = musicWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(musicWidget)

  const getMusic = async () => {
    const osVersion = await run(`sw_vers -productVersion`)
    const processName = cleanupOutput(osVersion) === '10.15' ? 'iTunes' : 'Music'
    const isRunning = await run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "${processName}"' 2>&1`
    )
    if (cleanupOutput(isRunning) === 'false') {
      setLoading(false)
      return
    }
    const [playerState, trackName, artistName] = await Promise.all([
      run(`osascript -e 'tell application "${processName}" to player state as string' 2>/dev/null || echo "stopped"`),
      run(
        `osascript -e 'tell application "${processName}" to name of current track as string' 2>/dev/null || echo "unknown track"`
      ),
      run(
        `osascript -e 'tell application "${processName}" to artist of current track as string' 2>/dev/null || echo "unknown artist"`
      )
    ])
    setState({
      playerState: cleanupOutput(playerState),
      trackName: cleanupOutput(trackName),
      artistName: cleanupOutput(artistName),
      processName: cleanupOutput(processName)
    })
    setLoading(false)
  }

  useWidgetRefresh(musicWidget, getMusic, refreshFrequency)

  if (loading) return <DataWidgetLoader className="music" />
  if (!state) return null
  const { processName, playerState, trackName, artistName } = state

  if (!trackName.length) return null

  const isPlaying = playerState === 'playing'
  const Icon = isPlaying ? PlayingIcon : PausedIcon

  const onClick = (e) => {
    clickEffect(e)
    togglePlay(!isPlaying, processName)
    getMusic()
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

export default Music
