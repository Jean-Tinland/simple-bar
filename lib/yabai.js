import * as Uebersicht from "uebersicht";
import * as Utils from "./utils";

export async function goToSpace(index) {
  await Uebersicht.run(`$(which yabai) -m space --focus ${index}`);
}

export async function renameSpace(index, label) {
  await Uebersicht.run(`$(which yabai) -m space ${index} --label "${label}"`);
}

export async function createSpace(displayId) {
  await Uebersicht.run(`$(which yabai) -m display --focus ${displayId}`);
  await Uebersicht.run(`$(which yabai) -m space --create`);
  await Utils.softRefresh();
}

export async function removeSpace(index, displayId) {
  await Uebersicht.run(`$(which yabai) -m display --focus ${displayId}`);
  await Uebersicht.run(`$(which yabai) -m space ${index} --destroy`);
  await Utils.softRefresh();
}

export async function swapSpace(index, direction) {
  const action = direction === "left" ? index - 1 : index + 1;
  await Uebersicht.run(`$(which yabai) -m space ${index} --swap ${action}`);
  await Utils.softRefresh();
}

export async function focusWindow(id) {
  await Uebersicht.run(`$(which yabai) -m window --focus ${id}`);
}

export async function getSpaces() {
  const json = await Uebersicht.run(`$(which yabai) -m query --spaces`);
  return Utils.parseJson(json);
}

export async function getWindows() {
  const json = await Uebersicht.run(`$(which yabai) -m query --windows`);
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

export async function getDisplays() {
  const json = await Uebersicht.run(`$(which yabai) -m query --displays`);
  return Utils.parseJson(json);
}
