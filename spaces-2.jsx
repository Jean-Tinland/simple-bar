import SpacesDisplay from './lib/components/SpacesDisplay.jsx'
import { SpacesDisplayStyles } from './lib/styles/Styles.js'

import { parseJson } from './lib/utils.js'

import { Theme } from './lib/styles/Theme.js'

const refreshFrequency = false

const className = /* css */ `
  .simple-bar__error,
  .simple-bar__spaces {
    position: fixed;
    top: 0;
    left: 0;
    padding: 4px;
    color: ${Theme.white};
    font-size: 11px;
    font-family: ${Theme.font};
    z-index: 1;
  }
  ${SpacesDisplayStyles}
`

const command = 'bash simple-bar/lib/scripts/get_spaces.sh'

export const updateState = (event, previousState) => {
  const { type } = event
  if (type === 'START-REMOVING') {
    return { ...previousState, removing: true }
  }
  if (type === 'STOP-REMOVING') {
    return { ...previousState, removing: undefined }
  }
  return event
}

const render = (state, dispatch) => {
  const { output, error, removing } = state
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>
  const data = parseJson(output)
  if (!data) return <div className="simple-bar__error">JSON error...</div>
  return (
    <div className="simple-bar__spaces">
      <SpacesDisplay output={data.spaces} SIP={data.SIP} displayId={2} dispatch={dispatch} removing={removing} />
    </div>
  )
}

export { command, refreshFrequency, className, render }
