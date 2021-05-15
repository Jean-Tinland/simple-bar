import Process from './lib/components/process/process.jsx'
import Settings from './lib/components/process/settings.jsx'
import Error from './lib/components/error.jsx'

import { classnames, parseJson, injectStyles } from './lib/utils'
import { getSettings } from './lib/settings'

import { variables } from './lib/styles/core/variables'
import { baseStyles } from './lib/styles/core/base'
import { processStyles } from './lib/styles/components/process'
import { settingsStyles } from './lib/styles/components/settings'
import { customStyles } from './lib/styles/custom-styles'

const refreshFrequency = false

const settings = getSettings()
const { yabaiPath = '/usr/local/bin/yabai', shell } = settings.global
const { processWidget } = settings.widgets

const command = `${shell} simple-bar/lib/scripts/get_process.sh ${yabaiPath}`

injectStyles('simple-bar-process-styles', [variables, baseStyles, processStyles, settingsStyles, customStyles])

const render = ({ output, error }) => {
  const classes = classnames('simple-bar simple-bar--process', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar
  })

  if (error) {
    console.log('Error in process.jsx', error)
    return <Error widget="process" type="error" classes={classes} withSettings />
  }
  if (!output) return <Error widget="process" type="noOutput" classes={classes} withSettings />

  const data = parseJson(output)
  if (!data) return <Error widget="process" type="noData" classes={classes} withSettings />

  const { process } = data

  return (
    <div className={classes}>
      {processWidget && <Process output={process} />}
      <Settings />
    </div>
  )
}

export { command, refreshFrequency, render }
