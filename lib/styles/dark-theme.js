import { Theme } from './theme'

import { getSettings } from '../settings'

const settings = getSettings()
const { font } = settings.global

export const Variables = /* css */ `
:root {
  --main: ${Theme.main};
  --mainAlt: ${Theme.mainAlt};
  --minor: ${Theme.minor};
  --accent: ${Theme.yellow};
  --red: ${Theme.red};
  --green: ${Theme.green};
  --yellow: ${Theme.yellow};
  --orange: ${Theme.orange};
  --blue: ${Theme.blue};
  --magenta: ${Theme.magenta};
  --cyan: ${Theme.cyan};
  --foreground: ${Theme.foreground};
  --background: ${Theme.main};
  --light-grey: ${Theme.lightGrey};
  --default-font: ${font !== '' ? font : Theme.defaultFont};
  --light-shadow: ${Theme.lightShadow};
  --transition-easing: ${Theme.easing};
}
`
