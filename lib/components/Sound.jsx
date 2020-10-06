import { VolumeHighIcon, VolumeLowIcon, NoVolumeIcon, VolumeMutedIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

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

  return (
    <div className="sound">
      <Icon className="sound__icon" />
      {volume}%
    </div>
  )
}

export default Sound
