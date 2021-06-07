import { run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { CoffeeIcon, ChargingIcon } from '../icons.jsx'
import { classnames, clickEffect, notification, refreshData } from '../../utils'

import { getSettings } from '../../settings'

export { batteryStyles } from '../../styles/components/data/battery'

const getTransform = (value) => {
  let transform = `0.${value}`
  if (value === '100') transform = '1'
  if (value < 10) transform = `0.0${value}`
  return `scaleX(${transform})`
}

const toggleCaffeinate = async (caffeinate, option) => {
  if (!caffeinate.length) {
    await run(`caffeinate ${option} &`)
    await refreshData()
    notification('Enabling caffeinate...')
  } else {
    await run(`kill ${caffeinate}`)
    await refreshData()
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

  const onClick = async (e) => {
    clickEffect(e)
    await toggleCaffeinate(caffeinate, caffeinateOption)
  }

  const Icon = () => (
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
  )

  return (
    <DataWidget classes={classes} Icon={Icon} onClick={onClick}>
      {caffeinate !== '' && <CoffeeIcon className="battery__caffeinate-icon" />}
      {percentage}%
    </DataWidget>
  )
}

export default Battery
