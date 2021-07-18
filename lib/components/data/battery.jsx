import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { CoffeeIcon, ChargingIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'
import { classnames, cleanupOutput, clickEffect, notification, refreshData } from '../../utils'
import { getSettings } from '../../settings'

export { batteryStyles } from '../../styles/components/data/battery'

const { useState } = React

const refreshFrequency = 10000

const getTransform = (value) => {
  let transform = `0.${value}`
  if (value === 100) transform = '1'
  if (value < 10) transform = `0.0${value}`
  return `scaleX(${transform})`
}

const toggleCaffeinate = (caffeinate, option) => {
  if (!caffeinate.length) {
    run(`caffeinate ${option} &`).then(refreshData)
    notification('Enabling caffeinate...')
  } else {
    run('pkill -f caffeinate').then(refreshData)
    notification('Disabling caffeinate...')
  }
}

const settings = getSettings()

const Battery = () => {
  const { widgets, batteryWidgetOptions } = settings
  const { batteryWidget } = widgets
  const { caffeinateOption } = batteryWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(batteryWidget)

  const getBattery = async () => {
    const [percentage, status, caffeinate] = await Promise.all([
      run(`pmset -g batt | egrep '([0-9]+%).*' -o --colour=auto | cut -f1 -d'%'`),
      run(`pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19`),
      run(`pgrep caffeinate`)
    ])
    setState({
      percentage: parseInt(percentage),
      charging: cleanupOutput(status) === 'AC',
      caffeinate: cleanupOutput(caffeinate)
    })
    setLoading(false)
  }

  useWidgetRefresh(batteryWidget, getBattery, refreshFrequency)

  if (loading) return <DataWidgetLoader className="battery" />
  if (!state) return null

  const { percentage, charging, caffeinate } = state
  const isLowBattery = !charging && percentage < 20

  const classes = classnames('battery', {
    'battery--low': isLowBattery,
    'battery--caffeinate': caffeinate.length
  })

  const transformValue = getTransform(percentage)

  const onClick = (e) => {
    clickEffect(e)
    toggleCaffeinate(caffeinate, caffeinateOption)
  }

  const Icon = () => (
    <div className="battery__icon">
      {charging && (
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
