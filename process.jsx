import Process from './lib/components/Process.jsx'
import Settings from './lib/components/Settings.jsx'

import { parseJson, getTheme } from './lib/utils.js'
import { getSettings } from './lib/settings.js'

import { styles } from './lib/styles/Styles.js'
import CustomStyles from './lib/styles/CustomStyles.js'

const refreshFrequency = false

const settings = getSettings()

const theme = getTheme(settings)
const Styles = styles[theme]

const className = `
  ${Styles.BaseStyles}
  ${Styles.ProcessStyles}
  ${Styles.SettingsStyles}

  ${settings.global.floatingBar ? Styles.FloatingBarOverride : ''}
  ${settings.global.noBarBg ? Styles.NoBarBgOverride : ''}
  ${settings.global.bottomBar ? Styles.BottomBarOverride : ''}
  ${settings.global.floatingBar && settings.global.bottomBar ? Styles.FloatinBottomBarOverride : ''}

  ${CustomStyles}
`

const command = 'bash simple-bar/lib/scripts/get_process.sh'

const render = ({ output, error }) => {
  if (error) {
    return (
      <div className="simple-bar simple-bar--process simple-bar--empty">
        <span>simple-bar-process.jsx: Something went wrong...</span>
      </div>
    )
  }
  if (!output) {
    return (
      <div className="simple-bar simple-bar--process simple-bar--loading simple-bar--empty">
        <span>simple-bar-process.jsx: Loading...</span>
      </div>
    )
  }
  const data = parseJson(output)
  if (!data) {
    return (
      <div className="simple-bar simple-bar--process simple-bar--empty">
        <span>simple-bar-process.jsx: JSON error...</span>
      </div>
    )
  }
  const { process } = data
  return (
    <div className="simple-bar simple-bar--process">
      <Process output={process} />
      <Settings />
    </div>
  )
}

export { command, refreshFrequency, className, render }
