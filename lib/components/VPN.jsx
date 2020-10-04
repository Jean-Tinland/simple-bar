// import styles from "./styles.jsx";
import { run } from 'uebersicht'
import { VPNIcon, VPNOffIcon } from './Icons.jsx'
import { classnames, clickEffect, refreshData } from '../utils.js'

const toggleVPN = (isConnected) => {
  if (isConnected) {
    run(`osascript -e 'tell application "Viscosity" to disconnect "office VPN"'`).then(refreshData)
  } else {
    run(`osascript -e 'tell application "Viscosity" to connect "office VPN"'`).then(refreshData)
  }
}

const render = ({ output }) => {
  if (!output) return null
  const { status } = output
  const isConnected = status === "Connected"

  const classes = classnames('vpn', {
    'vpn--disconnected': !isConnected
  })

  const Icon = isConnected ? VPNIcon : VPNOffIcon

  const clicked = (e) => {
    clickEffect(e)
    toggleVPN(isConnected)
  }

  return (
    <div className={classes} onClick={clicked}>
      <Icon className="vpn__icon" />
      {status}
    </div>
  )
};

export default render
