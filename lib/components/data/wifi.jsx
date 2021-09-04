import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

export { wifiStyles as styles } from '../../styles/components/data/wifi'

const refreshFrequency = 20000

const toggleWifi = (isActive, networkDevice) => {
  if (isActive) {
    Uebersicht.run(`networksetup -setairportpower ${networkDevice} off`)
    Utils.notification('Disabling network...')
  } else {
    Uebersicht.run(`networksetup -setairportpower ${networkDevice} on`)
    Utils.notification('Enabling network...')
  }
}

const openWifiPreferences = (e) => {
  Utils.clickEffect(e)
  Uebersicht.run(`open /System/Library/PreferencePanes/Network.prefPane/`)
}

const renderName = (name) => {
  if (!name) return ''
  if (name === 'with an AirPort network.y off.') return 'Disabled'
  if (name === 'with an AirPort network.') return 'Searching...'
  return name
}

const settings = Settings.get()

export const Widget = () => {
  const { wifiWidget } = settings.widgets
  const { toggleWifiOnClick, networkDevice } = settings.networkWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(wifiWidget)

  const getWifi = async () => {
    const [status, ssid] = await Promise.all([
      Uebersicht.run(`ifconfig ${networkDevice} | grep status | cut -c 10-`),
      Uebersicht.run(`networksetup -getairportnetwork ${networkDevice} | cut -c 24-`)
    ])
    setState({ status: Utils.cleanupOutput(status), ssid: Utils.cleanupOutput(ssid) })
    setLoading(false)
  }

  useWidgetRefresh(wifiWidget, getWifi, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="wifi" />
  if (!state) return null

  const { status, ssid } = state
  const isActive = status === 'active'
  const name = renderName(ssid)

  const classes = Utils.classnames('wifi', { 'wifi--inactive': !isActive })

  const Icon = isActive ? Icons.Wifi : Icons.WifiOff

  const onClick = (e) => {
    Utils.clickEffect(e)
    toggleWifi(isActive, networkDevice)
    getWifi()
  }

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      onClick={toggleWifiOnClick ? onClick : undefined}
      onRightClick={openWifiPreferences}
    >
      {name}
    </DataWidget.Widget>
  )
}
