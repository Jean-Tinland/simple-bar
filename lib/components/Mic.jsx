import { MicOn, MicOff } from './Icons.jsx'
import { run } from 'uebersicht'

import { clickEffect, refreshData } from '../utils.js'
import { getSettings } from '../settings.js'

const toggleMic = (volume) => {
  if (volume === '0') {
    run("osascript -e 'set volume input volume 100'").then(refreshData)
    run(
      `osascript -e 'tell app "System Events" to display notification "Enabling microphone..." with title "simple-bar"'`
    )
  } else {
    run("osascript -e 'set volume input volume 0'").then(refreshData)
    run(
      `osascript -e 'tell app "System Events" to display notification "Disabling microphone..." with title "simple-bar"'`
    )
  }
}

const Mic = ({ output }) => {
  const settings = getSettings()
  const { micWidget } = settings.widgets
  if (!micWidget || !output) return null

  const { volume } = output
  if (volume === 'missing value') return null

  const Icon = volume !== '0' ? MicOn : MicOff

  const clicked = (e) => {
    clickEffect(e)
    toggleMic(volume)
  }

  return (
    <div className="mic" onClick={clicked}>
      <Icon className="mic__icon" />
      {volume}%
    </div>
  )
}

export default Mic
