import Process from './lib/components/process/process.jsx'
import Settings from './lib/components/process/settings.jsx'
import Error from './lib/components/error.jsx'

import { parseJson, getTheme, loadStyles } from './lib/utils.js'
import { getSettings } from './lib/settings.js'

import { styles } from './lib/styles/styles.js'
import CustomStyles from './lib/styles/custom-styles.js'

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

const { yabaiPath, shell } = settings.global
const { processWidget } = settings.widgets

const command = `${shell} simple-bar/lib/scripts/get_process.sh ${yabaiPath}`

const render = ({ output, error }) => {
  loadStyles('simple-bar-variables', Styles.Variables)
  if (error) {
    console.log('Error in process.jsx', error)
    return <Error widget="process" type="error" withSettings />
  }
  if (!output) return <Error widget="process" type="noOutput" withSettings />

  const data = parseJson(output)
  if (!data) return <Error widget="process" type="noData" withSettings />

  const { process } = data
  return (
    <div className="simple-bar simple-bar--process">
      {processWidget && <Process output={process} />}
      <Settings />
    </div>
  )
}

export { command, refreshFrequency, className, render }
