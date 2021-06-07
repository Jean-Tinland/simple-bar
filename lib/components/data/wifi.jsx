import { run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { WifiIcon, WifiOffIcon } from '../icons.jsx'
import { classnames, clickEffect, notification, refreshData } from '../../utils'

import { getSettings } from '../../settings'

export { wifiStyles } from '../../styles/components/data/wifi'

const toggleWifi = async (isActive, networkDevice) => {
  if (isActive) {
    await run(`networksetup -setairportpower ${networkDevice} off`)
    await refreshData()
    notification('Disabling network...')
  } else {
    await run(`networksetup -setairportpower ${networkDevice} on`)
    await refreshData()
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

  const onClick = async (e) => {
    clickEffect(e)
    await toggleWifi(isActive, networkDevice)
  }

  return (
    <DataWidget classes={classes} Icon={Icon} onClick={toggleWifiOnClick ? onClick : undefined}>
      {name}
    </DataWidget>
  )
}

export default Wifi
