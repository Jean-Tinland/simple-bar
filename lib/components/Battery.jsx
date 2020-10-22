import { run } from 'uebersicht'

import { CoffeeIcon, ChargingIcon } from './Icons.jsx'
import { classnames, clickEffect, notification, refreshData } from '../utils.js'

import { getSettings } from '../settings.js'

const getTransform = (value) => {
  let transform = `0.${value}`
  if (value === '100') transform = '1'
  if (value < 10) transform = `0.0${value}`
  return `scaleX(${transform})`
}

const toggleCaffeinate = (caffeinate, option) => {
  if (caffeinate === '') {
    run(`caffeinate ${option} &`)
    notification('Enabling caffeinate...')
    refreshData()
  } else {
    run(`kill ${caffeinate}`).then(refreshData)
    notification('Disabling caffeinate...')
  }
}

const Battery = ({ output }) => {
  const settings = getSettings()
  const { widgets, batteryWidgetOptions } = settings
  const { batteryWidget } = widgets
  const { caffeinateOption } = batteryWidgetOptions
  if (!batteryWidget || !output) return null

  const { percentage, charging, caffeinate } = output
  const isCharging = charging === 'true'
  const isLowBattery = !isCharging && percentage < 20

  const classes = classnames('battery', {
    'battery--low': isLowBattery,
    'battery--caffeinate': caffeinate !== ''
  })

  const transformValue = getTransform(percentage)

  const onClick = (e) => {
    clickEffect(e)
    toggleCaffeinate(caffeinate, caffeinateOption)
  }

  return (
    <div className={classes} onClick={onClick}>
      {caffeinate !== '' && <CoffeeIcon className="battery__caffeinate-icon" />}
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
