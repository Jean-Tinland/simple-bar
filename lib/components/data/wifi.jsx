import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { WifiIcon, WifiOffIcon } from '../icons.jsx'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh'
import { classnames, cleanupOutput, clickEffect, notification } from '../../utils'
import { getSettings } from '../../settings'

export { wifiStyles } from '../../styles/components/data/wifi'

const { useState } = React

const refreshFrequency = 20000

const toggleWifi = (isActive, networkDevice) => {
  if (isActive) {
    run(`networksetup -setairportpower ${networkDevice} off`)
    notification('Disabling network...')
  } else {
    run(`networksetup -setairportpower ${networkDevice} on`)
    notification('Enabling network...')
  }
}

const renderName = (name) => {
  if (!name) return ''
  if (name === 'with an AirPort network. y off.') return 'Disabled'
  if (name === 'with an AirPort network.') return 'Searching...'
  return name
}

const settings = getSettings()

const Wifi = () => {
  const { wifiWidget } = settings.widgets
  const { toggleWifiOnClick, networkDevice } = settings.networkWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(wifiWidget)

  const getWifi = async () => {
    const [status, ssid] = await Promise.all([
      run(`ifconfig ${networkDevice} | grep status | cut -c 10-`),
      run(`networksetup -getairportnetwork ${networkDevice} | cut -c 24-`)
    ])
    setState({ status: cleanupOutput(status), ssid: cleanupOutput(ssid) })
    setLoading(false)
  }

  useWidgetRefresh(wifiWidget, getWifi, refreshFrequency)

  if (loading) return <DataWidgetLoader className="wifi" />
  if (!state) return null

  const { status, ssid } = state
  const isActive = status === 'active'
  const name = renderName(ssid)

  const classes = classnames('wifi', {
    'wifi--inactive': !isActive
  })

  const Icon = isActive ? WifiIcon : WifiOffIcon

  const onClick = (e) => {
    clickEffect(e)
    toggleWifi(isActive, networkDevice)
    getWifi()
  }

  return (
    <DataWidget classes={classes} Icon={Icon} onClick={toggleWifiOnClick ? onClick : undefined}>
      {name}
    </DataWidget>
  )
}

export default Wifi
