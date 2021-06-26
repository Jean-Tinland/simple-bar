import { Themes } from './themes'
import { pywalColors } from './pywal/pywal-colors'
import { getSettings } from '../settings'

const WITH_PYWAL = false

const overrideColors = WITH_PYWAL ? pywalColors : {}

const settings = getSettings()
const { themes } = settings

export const Theme = {
  light: { ...Themes[themes.lightTheme], ...overrideColors },
  dark: { ...Themes[themes.darkTheme], ...overrideColors }
}
