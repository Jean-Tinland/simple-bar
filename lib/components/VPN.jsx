import { run } from 'uebersicht'
import { VPNIcon, VPNOffIcon } from './Icons.jsx'
import { classnames, clickEffect, refreshData } from '../utils.js'

import { getSettings } from '../settings.js'

const toggleVPN = (isConnected, vpnConnectionName) => {
  if (isConnected) {
    run(`osascript -e 'tell application "Viscosity" to disconnect "${vpnConnectionName}"'`).then(refreshData)
    notification(`Disabling Viscosity ${vpnConnectionName} network...`)
  } else {
    run(`osascript -e 'tell application "Viscosity" to connect "${vpnConnectionName}"'`).then(refreshData)
    notification(`Enabling Viscosity ${vpnConnectionName} network...`)
  }
}

const render = ({ output, vpnConnectionName }) => {
  if (!output || vpnConnectionName === '') return null
  const settings = getSettings()
  const { vpnWidget } = settings.widgets
  if (!vpnWidget) return null

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
    <div className={classes} onClick={clicked}>
      <Icon className="vpn__icon" />
      {status}
    </div>
  )
}

export default render
