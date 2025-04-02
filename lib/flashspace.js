import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

/**
 * Fetches the configuration from the flashspace profiles JSON file.
 *
 * @returns {Promise<Object>} The parsed JSON configuration object.
 * @throws Will throw an error if the JSON parsing fails or the command execution fails.
 */
export async function getConfig() {
  const result = await Uebersicht.run("cat ~/.config/flashspace/profiles.json");
  return Utils.parseJson(result);
}

/**
 * Retrieves the current workspace using an AppleScript.
 *
 * @returns {Promise<string>} A promise that resolves to the current workspace.
 */
export async function getCurrentWorkspace() {
  const settings = Settings.get();
  const { flashspacePath = "/usr/local/bin/flashspace" } = settings.global;
  const result = await Uebersicht.run(`${flashspacePath} get-workspace`);
  return Utils.cleanupOutput(result);
}

/**
 * Switches to the specified workspace.
 * @param {string} name - The name of the workspace to switch to.
 * @returns {Promise<void>} A promise that resolves when the workspace is switched.
 */
export async function goToSpace(name) {
  const settings = Settings.get();
  const { flashspacePath = "/usr/local/bin/flashspace" } = settings.global;
  await Uebersicht.run(`${flashspacePath} workspace --name ${name}`);
}
