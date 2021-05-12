import { run } from 'uebersicht'
import { WifiIcon, WifiOffIcon } from '../icons.jsx'
import { classnames, clickEffect, notification, refreshData } from '../../utils'

import { getSettings } from '../../settings'

export { WifiStyles } from '../../styles/components/data/wifi'

const toggleWifi = (isActive, networkDevice) => {
  if (isActive) {
    run(`networksetup -setairportpower ${networkDevice} off`).then(refreshData)
    notification('Disabling network...')
  } else {
    run(`networksetup -setairportpower ${networkDevice} on`).then(refreshData)
    notification('Enabling network...')
  }
}

const renderName = (name) => {
  if (!name) return ''
  if (name === 'with an AirPort network. y off.') return 'Disabled'
  if (name === 'with an AirPort network.') return 'Searching...'
  return name
}

const Wifi = ({ output }) => {
  if (!output) return null
  const settings = getSettings()
  const { wifiWidget } = settings.widgets
  const { toggleWifiOnClick, networkDevice } = settings.networkWidgetOptions

  if (!wifiWidget) return null

  const { status, ssid } = output
  const isActive = status === 'active'
  const name = renderName(ssid)

  const classes = classnames('wifi', {
    'wifi--inactive': !isActive
  })

  const Icon = isActive ? WifiIcon : WifiOffIcon

  const onClick = (e) => {
    if (toggleWifiOnClick) {
      clickEffect(e)
      toggleWifi(isActive, networkDevice)
    }
  }

  return (
    <div className={classes} onClick={onClick}>
      <Icon className="wifi__icon" />
      {name}
    </div>
  )
}

export default Wifi
