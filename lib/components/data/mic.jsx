import { run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { MicOnIcon, MicOffIcon } from '../icons.jsx'

import { clickEffect, notification, refreshData } from '../../utils'
import { getSettings } from '../../settings'

export { micStyles } from '../../styles/components/data/mic'

const toggleMic = async (volume) => {
  if (volume === '0') {
    await run("osascript -e 'set volume input volume 100'")
    await refreshData()
    notification('Enabling microphone...')
  } else {
    await run("osascript -e 'set volume input volume 0'")
    await refreshData()
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

  const onClick = async (e) => {
    clickEffect(e)
    await toggleMic(volume)
  }

  return (
    <DataWidget classes="mic" Icon={Icon} onClick={onClick}>
      {volume}%
    </DataWidget>
  )
}

export default Mic
