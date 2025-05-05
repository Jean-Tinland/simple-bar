import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

/**
 * Switches to the specified workspace.
 * @param {number} index - The index of the workspace to switch to.
 */
export async function goToSpace(index) {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  await Uebersicht.run(`${aerospacePath} workspace ${index}`);
}

/**
 * Focuses the window with the specified ID.
 * @param {number} id - The ID of the window to focus.
 */
export async function focusWindow(id) {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  await Uebersicht.run(`${aerospacePath} focus --window-id ${id}`);
}

/**
 * Retrieves the list of workspaces for the specified display.
 * @param {number} displayId - The ID of the display.
 * @returns {Promise<Object[]>} The list of workspaces.
 */
export async function getSpaces(displayId) {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  const json = await Uebersicht.run(
    `${aerospacePath} list-workspaces --monitor ${displayId} --json --format "%{workspace} %{monitor-appkit-nsscreen-screens-id}"`,
  );
  return Utils.parseJson(json);
}

/**
 * Retrieves the currently focused workspace.
 * @returns {Promise<Object>} The focused workspace.
 */
export async function getFocusedSpace() {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  const json = await Uebersicht.run(
    `${aerospacePath} list-workspaces --focused --json`,
  );
  return Utils.parseJson(json);
}

/**
 * Retrieves the list of windows for the specified workspace.
 * @param {number} workspaceId - The ID of the workspace.
 * @returns {Promise<Object[]>} The list of windows.
 */
export async function getWindows(workspaceId) {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  const json = await Uebersicht.run(
    `${aerospacePath} list-windows --workspace ${workspaceId} --json`,
  );
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

/**
 * Retrieves the currently focused window.
 * @returns {Promise<Object>} The focused window.
 */
export async function getFocusedWindow() {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  const json = await Uebersicht.run(
    `${aerospacePath} list-windows --focused --json`,
  );
  return Utils.parseJson(json);
}

/**
 * Retrieves the list of displays.
 * @returns {Promise<Object[]>} The list of displays.
 */
export async function getDisplays() {
  const settings = Settings.get();
  const { aerospacePath = "/opt/homebrew/bin/aerospace" } = settings.global;
  const json = await Uebersicht.run(`${aerospacePath} list-monitors --json`);
  return Utils.parseJson(json);
}

/**
 * Retrieves the custom display index for the specified display.
 * @param {Object} display - The display object.
 * @returns {number} The custom display index.
 */
export function getCustomDisplayIndex(item) {
  const settings = Settings.get();
  const { customAeroSpaceDisplayIndexes } = settings.spacesDisplay;
  const nativeId = item["monitor-appkit-nsscreen-screens-id"];
  const customId = customAeroSpaceDisplayIndexes[nativeId];
  return customId || nativeId;
}
