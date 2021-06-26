import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { VPNIcon, VPNOffIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'
import { classnames, cleanupOutput, clickEffect, refreshData } from '../../utils'
import { getSettings } from '../../settings'

export { viscosityVPNStyles } from '../../styles/components/data/viscosity-vpn'

const { useState } = React

const refreshFrequency = 20000

const toggleVPN = (isConnected, vpnConnectionName) => {
  if (isConnected) {
    run(`osascript -e 'tell application "Viscosity" to disconnect "${vpnConnectionName}"'`).then(refreshData)
    notification(`Disabling Viscosity ${vpnConnectionName} network...`)
  } else {
    run(`osascript -e 'tell application "Viscosity" to connect "${vpnConnectionName}"'`).then(refreshData)
    notification(`Enabling Viscosity ${vpnConnectionName} network...`)
  }
}

const settings = getSettings()

const ViscosityVPN = () => {
  const { widgets, vpnWidgetOptions } = settings
  const { vpnWidget } = widgets
  const { vpnConnectionName } = vpnWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(vpnWidget)

  const getVPN = async () => {
    const isRunning = await run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "Viscosity"' 2>&1`
    )
    if (cleanupOutput(isRunning) === 'false') {
      setLoading(false)
      return
    }
    const status = await run(
      `osascript -e "tell application \"Viscosity\" to return state of the first connection where name is equal to \"${vpnConnectionName}\"" 2>/dev/null`
    )
    if (!status.length) return
    setState({ status: cleanupOutput(status) })
    setLoading(false)
  }

  useWidgetRefresh(vpnWidget, getVPN, refreshFrequency)

  if (loading) return <DataWidgetLoader className="viscosity-vpn" />
  if (!state || !vpnConnectionName.length) return null

  const { status } = state
  const isConnected = status === 'Connected'

  const classes = classnames('viscosity-vpn', {
    'viscosity-vpn--disconnected': !isConnected
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

export default ViscosityVPN
