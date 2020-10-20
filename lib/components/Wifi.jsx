import { run } from 'uebersicht'
import { WifiIcon, WifiOffIcon } from './Icons.jsx'
import { classnames, clickEffect, notification, refreshData } from '../utils.js'

import { getSettings } from '../settings.js'

const toggleWifi = (isActive) => {
  if (isActive) {
    run(`networksetup -setairportpower en0 off`).then(refreshData)
    notification('Disabling wifi...')
  } else {
    run(`networksetup -setairportpower en0 on`).then(refreshData)
    notification('Enabling wifi...')
  }
}

const renderName = (name) => {
  if (!name) return ''
  if (name === 'with an AirPort network. y off.') return 'Disabled'
  if (name === 'with an AirPort network.') return 'Searching...'
  return name
}

const render = ({ output }) => {
  if (!output) return null
  const settings = getSettings()
  const { wifiWidget } = settings.widgets
  if (!wifiWidget) return null

  const { status, ssid } = output
  const isActive = status === 'active'
  const name = renderName(ssid)

  const classes = classnames('wifi', {
    'wifi--inactive': !isActive
  })

  const Icon = isActive ? WifiIcon : WifiOffIcon

  const onClick = (e) => {
    clickEffect(e)
    toggleWifi(isActive)
  }

  return (
    <div className={classes} onClick={onClick}>
      <Icon className="wifi__icon" />
      {name}
    </div>
  )
}

export default render
