import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

const settings = Settings.get();
const { aerospacePath = "/usr/local/bin/yabai" } = settings.global;

export async function goToSpace(index) {
  await Uebersicht.run(`${aerospacePath} workspace ${index}`);
}

export async function focusWindow(id) {
  await Uebersicht.run(`${aerospacePath} focus --window-id ${id}`);
}

export async function getSpaces(displayId) {
  const json = await Uebersicht.run(
    `${aerospacePath} list-workspaces --monitor ${displayId} --json --format "%{workspace}"`
  );
  return Utils.parseJson(json);
}

export async function getFocusedSpace() {
  const json = await Uebersicht.run(
    `${aerospacePath} list-workspaces --focused --json`
  );
  return Utils.parseJson(json);
}

export async function getWindows(workspaceId) {
  const json = await Uebersicht.run(
    `${aerospacePath} list-windows --workspace ${workspaceId} --json`
  );
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

export async function getFocusedWindow() {
  const json = await Uebersicht.run(
    `${aerospacePath} list-windows --focused --json`
  );
  return Utils.parseJson(json);
}

export async function getDisplays() {
  const json = await Uebersicht.run(`${aerospacePath} list-monitors --json`);
  return Utils.parseJson(json);
}
