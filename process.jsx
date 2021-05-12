import Process from './lib/components/process/process.jsx'
import Settings from './lib/components/process/settings.jsx'
import Error from './lib/components/error.jsx'

import { parseJson, loadStyles } from './lib/utils'
import { getSettings } from './lib/settings'

import { Variables } from './lib/styles/dark-theme'
import { BaseStyles } from './lib/styles/core/base'
import { ProcessStyles } from './lib/styles/components/process'
import { SettingsStyles } from './lib/styles/components/settings'
import { CustomStyles } from './lib/styles/custom-styles'

const refreshFrequency = false

const settings = getSettings()

const className = `
  ${BaseStyles}
  ${ProcessStyles}
  ${SettingsStyles}
  ${CustomStyles}
`
// ${settings.global.floatingBar ? Styles.FloatingBarOverride : ''}
// ${settings.global.noBarBg ? Styles.NoBarBgOverride : ''}
// ${settings.global.bottomBar ? Styles.BottomBarOverride : ''}
// ${settings.global.floatingBar && settings.global.bottomBar ? Styles.FloatinBottomBarOverride : ''}

const { yabaiPath, shell } = settings.global
const { processWidget } = settings.widgets

const command = `${shell} simple-bar/lib/scripts/get_process.sh ${yabaiPath}`

const render = ({ output, error }) => {
  loadStyles('simple-bar-variables', Variables)
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
