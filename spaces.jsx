import Spaces from './lib/components/Spaces.jsx'

import { parseJson, getTheme } from './lib/utils.js'

import { styles } from './lib/styles/Styles.js'

const refreshFrequency = false

const theme = getTheme()
const Styles = styles[theme]

const className = /* css */ `
  ${Styles.BaseStyles}
  ${Styles.SpacesStyles}
`

const command = 'bash simple-bar/lib/scripts/get_spaces.sh'

const render = (state) => {
  const { output, error } = state
  if (!output || error) {
    return (
      <div className="simple-bar simple-bar--spaces simple-bar--empty">
        <span>simple-bar-spaces.jsx: Something went wrong...</span>
      </div>
    )
  }
  const data = parseJson(output)
  if (!data) {
    return (
      <div className="simple-bar simple-bar--spaces simple-bar--empty">
        <span>simple-bar-spaces.jsx: JSON error...</span>
      </div>
    )
  }
  return (
    <div className="simple-bar simple-bar--spaces">
      <Spaces output={data.spaces} SIP={data.SIP} displayId={1} />
    </div>
  )
}

export { command, refreshFrequency, className, render }
