import { run } from 'uebersicht'
import { MicOnIcon, MicOffIcon } from '../icons.jsx'

import { clickEffect, notification, refreshData } from '../../utils'
import { getSettings } from '../../settings'

export { MicStyles } from '../../styles/components/data/mic'

const toggleMic = (volume) => {
  if (volume === '0') {
    run("osascript -e 'set volume input volume 100'").then(refreshData)
    notification('Enabling microphone...')
  } else {
    run("osascript -e 'set volume input volume 0'").then(refreshData)
    notification('Disabling microphone...')
  }
}

const Mic = ({ output }) => {
  const settings = getSettings()
  const { micWidget } = settings.widgets
  if (!micWidget || !output) return null

  const { volume } = output
  if (volume === 'missing value') return null

  const Icon = volume !== '0' ? MicOnIcon : MicOffIcon

  const onClick = (e) => {
    clickEffect(e)
    toggleMic(volume)
  }

  return (
    <div className="mic" onClick={onClick}>
      <Icon className="mic__icon" />
      {volume}%
    </div>
  )
}

export default Mic
