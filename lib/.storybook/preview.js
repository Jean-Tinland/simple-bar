import { Themes } from '../styles/themes'

var themeItems = []

for (var theme in Themes) {
  themeItems.push({ value: theme, title: Themes[theme].name })
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'NightShiftDark',
    toolbar: {
      icon: 'mirror',
      // Array of plain string values or MenuItem shape (see below)
      items: themeItems,
      // Property that specifies if the name of the item will be displayed
      showName: true
    }
  }
}

export const parameters = {
  backgrounds: {
    grid: {
      disable: true
    }
  }
}

import { getSettings, setSettings } from '../settings'
import { variables } from '../styles/core/variables'
import { injectStyles } from '../utils'
import { baseStyles } from '../styles/core/base'
import { spacesStyles } from '../styles/components/spaces/spaces'
import { processStyles } from '../styles/components/process'

export const decorators = [
  (Story, context) => {
    const theme = Themes[context.globals.theme]
    var settings = getSettings()

    if (settings.global.theme != theme.kind || settings.themes[`${theme.kind}Theme`] != context.globals.theme) {
      settings.global.theme = theme.kind
      settings.themes[`${theme.kind}Theme`] = context.globals.theme

      setSettings(settings).then(() => {
        alert("Press Cmd-R to see new theme\n\nIdk why I can't get it to reload in place")
      })
    }

    injectStyles('simple-bar-spaces-styles', [variables, baseStyles, spacesStyles, processStyles])

    return (
      <div className={'simple-bar simple-bar--spaces'} data-theme={theme.name}>
        <Story {...context} />
      </div>
    )
  }
]
