import { run } from 'uebersicht'
import { Wifi, WifiOff } from './Icons.jsx'
import { classnames, clickEffect } from '../utils.js'

const refreshData = () =>
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-data-jsx"'`)

const toggleWifi = (isActive) => {
  if (isActive) {
    run(`networksetup -setairportpower en0 off`).then(refreshData)
    run(`osascript -e 'tell app "System Events" to display notification "Disabling wifi..." with title "simple-bar"'`)
  } else {
    run(`networksetup -setairportpower en0 on`).then(refreshData)
    run(`osascript -e 'tell app "System Events" to display notification "Enabling wifi..." with title "simple-bar"'`)
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
  const { status, ssid } = output
  const isActive = status === 'active'
  const name = renderName(ssid)

  const classes = classnames('wifi', {
    'wifi--inactive': !isActive
  })

  const Icon = isActive ? Wifi : WifiOff

  const clicked = (e) => {
    clickEffect(e)
    toggleWifi(isActive)
  }

  return (
    <div className={classes} onClick={clicked}>
      <Icon className="wifi__icon" />
      {name}
    </div>
  )
}

export default render
