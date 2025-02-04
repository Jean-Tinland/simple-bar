import * as Themes from "./themes";
import * as Pywal from "./pywal/pywal-colors";

const WITH_PYWAL = false;

const overrideColors = WITH_PYWAL ? Pywal.colors : {};

/**
 * Generates color themes by merging the specified themes with override colors.
 *
 * @param {Object} themes - An object containing the light and dark theme names.
 * @param {string} themes.lightTheme - The name of the light theme.
 * @param {string} themes.darkTheme - The name of the dark theme.
 * @returns {Object} An object containing the light and dark color themes.
 */
export function colors(themes) {
  return {
    light: { ...Themes.collection[themes.lightTheme], ...overrideColors },
    dark: { ...Themes.collection[themes.darkTheme], ...overrideColors },
  };
}
