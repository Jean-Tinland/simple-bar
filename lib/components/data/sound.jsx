import { run } from 'uebersicht'
import { VolumeHighIcon, VolumeLowIcon, NoVolumeIcon, VolumeMutedIcon } from '../icons.jsx'

import { getSettings } from '../../settings.js'

const getIcon = (volume, muted) => {
  let Icon = VolumeHighIcon
  if (volume < 50) Icon = VolumeLowIcon
  if (volume === '0') Icon = NoVolumeIcon
  if (muted === 'true' && volume !== '0') Icon = VolumeMutedIcon
  return Icon
}

const Sound = ({ output }) => {
  const settings = getSettings()
  const { soundWidget } = settings.widgets
  if (!soundWidget || !output) return null

  const { volume, muted } = output
  if (volume === 'missing value' || muted === 'missing value') return null

  const Icon = getIcon(volume, muted)

  const onClick = (e) => {
    run(
      `osascript -e 'tell application "System Preferences"' -e 'activate' -e 'set current pane to pane "com.apple.preference.sound"' -e 'end tell'`
    )
  }

  return (
    <div className="sound" onClick={onClick}>
      <Icon className="sound__icon" />
      {volume}%
    </div>
  )
}

export default Sound
