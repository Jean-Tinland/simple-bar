import * as Themes from "./themes";
import * as Pywal from "./pywal/pywal-colors";

const WITH_PYWAL = false;

const overrideColors = WITH_PYWAL ? Pywal.colors : {};

export function colors(themes) {
  return {
    light: { ...Themes.collection[themes.lightTheme], ...overrideColors },
    dark: { ...Themes.collection[themes.darkTheme], ...overrideColors },
  };
}
