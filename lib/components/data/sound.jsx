import { run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { VolumeHighIcon, VolumeLowIcon, NoVolumeIcon, VolumeMutedIcon } from '../icons.jsx'

import { getSettings } from '../../settings'
import { clickEffect } from '../../utils.js'

export { soundStyles } from '../../styles/components/data/sound'

const getIcon = (volume, muted) => {
  if (volume < 50) return VolumeLowIcon
  if (volume === '0') return NoVolumeIcon
  if (muted === 'true' && volume !== '0') return VolumeMutedIcon
  return VolumeHighIcon
}

const openSoundSettings = () => {
  run(
    `osascript -e 'tell application "System Preferences"' -e 'activate' -e 'set current pane to pane "com.apple.preference.sound"' -e 'end tell'`
  )
}

const Sound = ({ output }) => {
  const settings = getSettings()
  const { soundWidget } = settings.widgets
  if (!soundWidget || !output) return null

  const { volume, muted } = output
  if (volume === 'missing value' || muted === 'missing value') return null

  const Icon = getIcon(volume, muted)

  const onClick = (e) => {
    clickEffect(e)
    openSoundSettings()
  }

  return (
    <DataWidget classes="sound" Icon={Icon} onClick={onClick}>
      {volume}%
    </DataWidget>
  )
}

export default Sound
