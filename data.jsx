import Time from './lib/components/Time.jsx'
import DateDisplay from './lib/components/Date.jsx'
import Battery from './lib/components/Battery.jsx'
import VPN from './lib/components/VPN.jsx'

import { parseJson } from './lib/utils.js'

import { DateStyles, TimeStyles, BatteryStyles, VPNStyles } from './lib/styles/Styles.js'
import { Theme } from './lib/styles/Theme.js'

const refreshFrequency = 10000

const className = /* css */ `
  .simple-bar__error,
  .simple-bar__data {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    margin-left: auto;
    padding: 4px 5px;
    color: ${Theme.main};
    font-family: ${Theme.font};
    font-size: 12px;
    z-index: 1;
  }
  .simple-bar__data > *:not(:last-of-type) {
    margin-right: 5px;
  }
  ${DateStyles}
  ${TimeStyles}
  ${BatteryStyles}
  ${VPNStyles}
`

const command = 'bash simple-bar/lib/scripts/get_data.sh'

const render = ({ output, error }) => {
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>
  const data = parseJson(output)
  if (!data) return <div className="simple-bar__error">JSON error...</div>
  const { time, battery, vpn } = data
  return (
    <div className="simple-bar__data">
      <Battery output={battery} />
      <VPN output={vpn} />
      <DateDisplay />
      <Time output={time} />
    </div>
  )
}

export { command, refreshFrequency, className, render }
