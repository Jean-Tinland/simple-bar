import { run } from 'uebersicht'
import { Wifi, WifiOff } from './Icons.jsx'

const refreshData = () =>
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-data-jsx"'`)

const toggleWifi = (isActive) => {
  if (isActive) {
    run(`networksetup -setairportpower en0 off`)
    run(`osascript -e 'tell app "System Events" to display notification "Disabling wifi..." with title "simple-bar"'`)
  } else {
    run(`networksetup -setairportpower en0 on`)
    run(`osascript -e 'tell app "System Events" to display notification "Enabling wifi..." with title "simple-bar"'`)
  }
  refreshData()
}

const renderName = (name) => {
  if (!name) return ''
  if (name === 'with an AirPort network. y off.') return 'Disabled'
  if (name === 'with an AirPort network.') return 'Searching...'
  return name
}

const render = ({ output }) => {
  if (!output) return null
  const { status, ssid } = output
  const isActive = status === 'active'
  const name = renderName(ssid)

  const classes = isActive ? 'wifi' : 'wifi wifi--inactive'

  const Icon = isActive ? Wifi : WifiOff

  const clicked = () => toggleWifi(isActive)

  return (
    <div className={classes} onClick={clicked}>
      <Icon className="wifi__icon" />
      {name}
    </div>
  )
}

export default render
