import Error from './lib/components/error.jsx'
import Spaces from './lib/components/spaces/spaces.jsx'
import Process from './lib/components/process/process.jsx'
import Settings from './lib/components/process/settings.jsx'
import { classnames, injectStyles, parseJson } from './lib/utils'
import { getSettings } from './lib/settings'
import { variables } from './lib/styles/core/variables'
import { baseStyles } from './lib/styles/core/base'
import { spacesStyles } from './lib/styles/components/spaces/spaces'
import { processStyles } from './lib/styles/components/process'
import { settingsStyles } from './lib/styles/components/settings'
import { customStyles } from './lib/styles/custom-styles'

const refreshFrequency = false

const settings = getSettings()
const { yabaiPath = '/usr/local/bin/yabai', shell } = settings.global
const { processWidget } = settings.widgets

const command = `${shell} simple-bar/lib/scripts/init.sh ${yabaiPath}`

injectStyles('simple-bar-spaces-styles', [
  variables,
  baseStyles,
  spacesStyles,
  processStyles,
  settingsStyles,
  customStyles
])

const render = ({ output, error }) => {
  const classes = classnames('simple-bar simple-bar--spaces', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar,
    'simple-bar--inline-spaces-options': settings.global.inlineSpacesOptions
  })

  if (error) {
    console.log('Error in spaces.jsx', error)
    return <Error type="error" classes={classes} withSettings />
  }
  if (!output) return <Error type="noOutput" classes={classes} withSettings />

  const data = parseJson(output)
  if (!data) return <Error type="noData" classes={classes} withSettings />

  const { displays, SIP, spaces: spacesList } = data
  const { spaces, windows } = spacesList

  const displayId = parseInt(window.location.pathname.replace('/', ''))
  const displayIndex = displays.find((d) => d.id === displayId).index
  const visibleSpaces = spaces.reduce((acc, space) => (space.visible === 1 ? [...acc, space.index] : acc), [])

  return (
    <div className={classes}>
      <Spaces output={spacesList} SIP={SIP} displayIndex={displayIndex} />
      {processWidget && (
        <Process displayIndex={displayIndex} spaces={spaces} visibleSpaces={visibleSpaces} windows={windows} />
      )}
      <Settings />
    </div>
  )
}

export { command, refreshFrequency, render }
