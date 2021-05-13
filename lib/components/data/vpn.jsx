import { run } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { VPNIcon, VPNOffIcon } from '../icons.jsx'
import { classnames, clickEffect, refreshData } from '../../utils'

import { getSettings } from '../../settings'

export { VPNStyles } from '../../styles/components/data/vpn'

const toggleVPN = (isConnected, vpnConnectionName) => {
  if (isConnected) {
    run(`osascript -e 'tell application "Viscosity" to disconnect "${vpnConnectionName}"'`).then(refreshData)
    notification(`Disabling Viscosity ${vpnConnectionName} network...`)
  } else {
    run(`osascript -e 'tell application "Viscosity" to connect "${vpnConnectionName}"'`).then(refreshData)
    notification(`Enabling Viscosity ${vpnConnectionName} network...`)
  }
}

const VPN = ({ output }) => {
  const settings = getSettings()
  const { widgets, vpnWidgetOptions } = settings
  const { vpnWidget } = widgets
  const { vpnConnectionName } = vpnWidgetOptions
  if (!output || vpnConnectionName === '' || !vpnWidget) return null

  const { status } = output
  const isConnected = status === 'Connected'

  const classes = classnames('vpn', {
    'vpn--disconnected': !isConnected
  })

  const Icon = isConnected ? VPNIcon : VPNOffIcon

  const clicked = (e) => {
    clickEffect(e)
    toggleVPN(isConnected, vpnConnectionName)
  }

  return (
    <DataWidget classes={classes} Icon={Icon} onClick={clicked}>
      {status}
    </DataWidget>
  )
}

export default VPN
