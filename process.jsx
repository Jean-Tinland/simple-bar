import Process from './lib/components/Process.jsx'

import { parseJson } from './lib/utils.js'

import { ProcessStyles } from './lib/styles/Styles.js'
import { Theme } from './lib/styles/Theme.js'

const refreshFrequency = false

const className = `
  .simple-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 4px 5px;
    box-sizing: border-box;
    color: white;
    font-family: ${Theme.font};
    font-size: 12px;
    background-color: ${Theme.main};
    z-index: 0;
  }
  .simple-bar--empty {
    text-align: center;
  }
  ${ProcessStyles}
`

const command = 'bash simple-bar/lib/scripts/get_process.sh'

const render = ({ output, error }) => {
  if (!output || error) return <div className="simple-bar simple-bar--empty">Something went wrong...</div>
  const data = parseJson(output)
  if (!data) return <div className="simple-bar simple-bar--empty">JSON error...</div>
  const { process } = data
  return (
    <div className="simple-bar">
      <Process output={process} />
    </div>
  )
}

export { command, refreshFrequency, className, render }
