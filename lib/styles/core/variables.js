import { Theme } from '../theme'
import { getSettings } from '../../settings'

const settings = getSettings()
const { font, fontSize, theme } = settings.global

const themedVariables = (scheme) => /* css */ `
:root {
  --main: ${Theme[scheme].main};
  --main-alt: ${Theme[scheme].mainAlt};
  --minor: ${Theme[scheme].minor};
  --accent: ${Theme[scheme].yellow};
  --red: ${Theme[scheme].red};
  --green: ${Theme[scheme].green};
  --yellow: ${Theme[scheme].yellow};
  --orange: ${Theme[scheme].orange};
  --blue: ${Theme[scheme].blue};
  --magenta: ${Theme[scheme].magenta};
  --cyan: ${Theme[scheme].cyan};
  --black: ${Theme[scheme].black};
  --white: ${Theme[scheme].white};
  --foreground: ${Theme[scheme].foreground};
  --background: ${Theme[scheme].main};
  --transparent-dark: ${Theme[scheme].transparentDark};
  --font: ${font.trim().length ? font : Theme[scheme].defaultFont};
  --font-size: ${fontSize.trim().length ? fontSize : '11px'};
  --bar-height: ${Theme[scheme].barHeight};
  --bar-radius: ${Theme[scheme].barRadius};
  --bar-inner-margin: ${Theme[scheme].barInnerMargin};
  --item-radius: ${Theme[scheme].itemRadius};
  --item-inner-margin: ${Theme[scheme].itemInnerMargin};
  --item-outer-margin: ${Theme[scheme].itemOuterMargin};
  --hover-ring: ${Theme[scheme].hoverRing};
  --focus-ring: ${Theme[scheme].focusRing};
  --light-shadow: ${Theme[scheme].lightShadow};
  --transition-easing: ${Theme[scheme].transitionEasing};
  --click-effect: ${Theme[scheme].clickEffect};
}
`

const darkVariables = themedVariables('dark')
const lightVariables = themedVariables('light')

const buildVariables = () => {
  if (theme === 'auto') {
    return /* css */ `
      @media (prefers-color-scheme: light) {
        ${lightVariables}
      }
      @media (prefers-color-scheme: dark) {
        ${darkVariables}
      }
    `
  }
  if (theme === 'light') return lightVariables
  return darkVariables
}

export const variables = buildVariables()
