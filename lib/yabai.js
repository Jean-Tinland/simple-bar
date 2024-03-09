import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

const settings = Settings.get();
const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;

export async function goToSpace(index) {
  await Uebersicht.run(`${yabaiPath} -m space --focus ${index}`);
}

export async function renameSpace(index, label) {
  await Uebersicht.run(`${yabaiPath} -m space ${index} --label "${label}"`);
}

export async function createSpace(displayId) {
  await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`);
  await Uebersicht.run(`${yabaiPath} -m space --create`);
  await Utils.softRefresh();
}

export async function removeSpace(index, displayId) {
  await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`);
  await Uebersicht.run(`${yabaiPath} -m space ${index} --destroy`);
  await Utils.softRefresh();
}

export async function swapSpace(index, direction) {
  const action = direction === "left" ? index - 1 : index + 1;
  await Uebersicht.run(`${yabaiPath} -m space ${index} --swap ${action}`);
  await Utils.softRefresh();
}

export async function focusWindow(id) {
  await Uebersicht.run(`${yabaiPath} -m window --focus ${id}`);
}

export async function getSpaces() {
  const json = await Uebersicht.run(`${yabaiPath} -m query --spaces`);
  return Utils.parseJson(json);
}

export async function getWindows() {
  const json = await Uebersicht.run(`${yabaiPath} -m query --windows`);
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

export async function getDisplays() {
  const json = await Uebersicht.run(`${yabaiPath} -m query --displays`);
  return Utils.parseJson(json);
}
