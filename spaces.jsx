import Spaces from './lib/components/spaces/spaces.jsx'
import Error from './lib/components/error.jsx'

import { parseJson } from './lib/utils'
import { getSettings } from './lib/settings'

import { SpacesStyles } from './lib/styles/components/spaces'
import { BaseStyles } from './lib/styles/core/base'
import CustomStyles from './lib/styles/custom-styles'

const refreshFrequency = false

const settings = getSettings()

const className = `
  ${BaseStyles}
  ${SpacesStyles}
  ${CustomStyles}
`
// ${settings.global.floatingBar ? Styles.FloatingBarOverride : ''}
// ${settings.global.noBarBg ? Styles.NoBarBgOverride : ''}
// ${settings.global.bottomBar ? Styles.BottomBarOverride : ''}
// ${settings.global.floatingBar && settings.global.bottomBar ? Styles.FloatinBottomBarOverride : ''}
// ${settings.global.inlineSpacesOptions ? Styles.InlineSpacesOptionsOverride : ''}

const { yabaiPath, shell } = settings.global

const command = `${shell} simple-bar/lib/scripts/get_spaces.sh ${yabaiPath}`

const render = ({ output, error }) => {
  if (error) {
    console.log('Error in spaces.jsx', error)
    return <Error widget="spaces" type="error" />
  }
  if (error) return <Error widget="spaces" type="error" />
  if (!output) return <Error widget="spaces" type="noOutput" />
  const data = parseJson(output)
  if (!data) return <Error widget="spaces" type="noData" />
  const displayId = parseInt(window.location.pathname.replace('/', ''))
  const displayIndex = data.displays.find((d) => d.id === displayId).index

  return (
    <div className="simple-bar simple-bar--spaces">
      <Spaces output={data.spaces} SIP={data.SIP} displayIndex={displayIndex} />
    </div>
  )
}

export { command, refreshFrequency, className, render }
