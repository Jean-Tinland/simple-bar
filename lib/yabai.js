import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

/**
 * Focuses on the specified space.
 * @param {number} index - The index of the space to focus on.
 */
export async function goToSpace(index) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m space --focus ${index}`);
}

/**
 * Renames the specified space.
 * @param {number} index - The index of the space to rename.
 * @param {string} label - The new label for the space.
 */
export async function renameSpace(index, label) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m space ${index} --label "${label}"`);
}

/**
 * Creates a new space on the specified display.
 * @param {number} displayId - The ID of the display to create the space on.
 */
export async function createSpace(displayId) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  await focusDisplay(displayId);
  await Uebersicht.run(`${yabaiPath} -m space --create`);
  await Utils.softRefresh();
}

/**
 * Removes the specified space from the specified display.
 * @param {number} index - The index of the space to remove.
 * @param {number} displayId - The ID of the display to remove the space from.
 */
export async function removeSpace(index, displayId) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  await focusDisplay(displayId);
  await Uebersicht.run(`${yabaiPath} -m space ${index} --destroy`);
  await Utils.softRefresh();
}

/**
 * Swaps the specified space with the space in the given direction.
 * @param {number} index - The index of the space to swap.
 * @param {string} direction - The direction to swap the space ("left" or "right").
 */
export async function swapSpace(index, direction) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  const action = direction === "left" ? index - 1 : index + 1;
  await Uebersicht.run(`${yabaiPath} -m space ${index} --swap ${action}`);
  await Utils.softRefresh();
}

/**
 * Focuses on the specified window.
 * @param {number} id - The ID of the window to focus on.
 */
export async function focusWindow(id) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m window --focus ${id}`);
}

/**
 * Retrieves the list of spaces.
 * @returns {Promise<Object[]>} A promise that resolves to the list of spaces.
 */
export async function getSpaces() {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  const json = await Uebersicht.run(`${yabaiPath} -m query --spaces`);
  return Utils.parseJson(json);
}

/**
 * Retrieves the list of windows.
 * @returns {Promise<Object[]>} A promise that resolves to the list of windows.
 */
export async function getWindows() {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  const json = await Uebersicht.run(`${yabaiPath} -m query --windows`);
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

/**
 * Retrieves the list of displays.
 * @returns {Promise<Object[]>} A promise that resolves to the list of displays.
 */
export async function getDisplays() {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  const json = await Uebersicht.run(`${yabaiPath} -m query --displays`);
  return Utils.parseJson(json);
}

/**
 * Focus the given display.
 *
 * Silently ignores the error thrown when the display is already focused,
 * which is a known and harmless yabai behavior.
 *
 * @param {number|string} displayId - The ID of the display to focus.
 */
async function focusDisplay(displayId) {
  const settings = Settings.get();
  const { yabaiPath = "/opt/homebrew/bin/yabai" } = settings.global;
  try {
    await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`);
  } catch (e) {
    const message = e?.toString?.() || "";
    if (!message.includes("cannot focus an already focused display")) {
      // eslint-disable-next-line no-console
      console.warn("Failed to focus display:", message);
    }
  }
}
