import { ChargingIcon } from './Icons.jsx'
import { classnames } from '../utils.js'

import { getSettings } from '../settings.js'

const getTransform = (value) => {
  let transform = `0.${value}`
  if (value === '100') transform = '1'
  if (value < 10) transform = `0.0${value}`
  return `scaleX(${transform})`
}

const Battery = ({ output }) => {
  const settings = getSettings()
  const { batteryWidget } = settings.widgets
  if (!batteryWidget || !output) return null

  const { percentage, charging } = output
  const isCharging = charging === 'true'
  const isLowBattery = !isCharging && percentage < 20

  const classes = classnames('battery', {
    'battery--low': isLowBattery
  })

  const transformValue = getTransform(percentage)

  return (
    <div className={classes}>
      <div className="battery__icon">
        {isCharging && (
          <div className="battery__charging-icon">
            <ChargingIcon className="battery__charging-icon-outline-left" />
            <ChargingIcon className="battery__charging-icon-fill" />
            <ChargingIcon className="battery__charging-icon-outline-right" />
          </div>
        )}
        <div className="battery__icon-filler" style={{ transform: transformValue }} />
      </div>
      {percentage}%
    </div>
  )
}

export default Battery
