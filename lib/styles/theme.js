import * as Themes from './themes'
import * as Pywal from './pywal/pywal-colors'
import * as Settings from '../settings'

const WITH_PYWAL = false

const overrideColors = WITH_PYWAL ? Pywal.colors : {}

const settings = Settings.get()
const { themes } = settings

export const colors = {
  light: { ...Themes.collection[themes.lightTheme], ...overrideColors },
  dark: { ...Themes.collection[themes.darkTheme], ...overrideColors }
}
