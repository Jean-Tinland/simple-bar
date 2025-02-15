import * as Uebersicht from "uebersicht";
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
  const result = await Uebersicht.run(
    "osascript ./simple-bar/lib/scripts/get-flashspace-space.applescript"
  );
  return Utils.cleanupOutput(result);
}
