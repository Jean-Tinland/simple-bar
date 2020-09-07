import Spaces from './lib/components/Spaces.jsx'
import { SpacesStyles } from './lib/styles/Styles.js'

import { parseJson } from './lib/utils.js'

import { Theme } from './lib/styles/Theme.js'

const refreshFrequency = false

const className = /* css */ `
  .simple-bar__error,
  .simple-bar__spaces {
    position: fixed;
    top: 0;
    left: 0;
    padding: 4px 5px;
    color: white;
    font-size: 11px;
    font-family: ${Theme.font};
    z-index: 1;
  }
  ${SpacesStyles}
`

const command = 'bash simple-bar/lib/scripts/get_spaces.sh'

const render = (state) => {
  const { output, error } = state
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>
  const data = parseJson(output)
  if (!data) return <div className="simple-bar__error">JSON error...</div>
  return (
    <div className="simple-bar__spaces">
      <Spaces output={data.spaces} SIP={data.SIP} displayId={1} />
    </div>
  )
}

export { command, refreshFrequency, className, render }
