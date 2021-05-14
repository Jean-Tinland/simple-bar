import Spaces from './lib/components/spaces/spaces.jsx'
import Error from './lib/components/error.jsx'

import { classnames, injectStyles, parseJson } from './lib/utils'
import { getSettings } from './lib/settings'

import { spacesStyles } from './lib/styles/components/spaces/spaces'

const refreshFrequency = false

const settings = getSettings()

const { yabaiPath = '/usr/local/bin/yabai', shell } = settings.global

const command = `${shell} simple-bar/lib/scripts/get_spaces.sh ${yabaiPath}`

const render = ({ output, error }) => {
  injectStyles('simple-bar-spaces-styles', [spacesStyles])

  const classes = classnames('simple-bar simple-bar--spaces', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar,
    'simple-bar--inline-spaces-options': settings.global.inlineSpacesOptions
  })

  if (error) {
    console.log('Error in spaces.jsx', error)
    return <Error widget="spaces" type="error" classes={classes} />
  }
  if (!output) return <Error widget="spaces" type="noOutput" classes={classes} />

  const data = parseJson(output)
  if (!data) return <Error widget="spaces" type="noData" classes={classes} />

  const displayId = parseInt(window.location.pathname.replace('/', ''))
  const displayIndex = data.displays.find((d) => d.id === displayId).index

  return (
    <div className={classes}>
      <Spaces output={data.spaces} SIP={data.SIP} displayIndex={displayIndex} />
    </div>
  )
}

export { command, refreshFrequency, render }
