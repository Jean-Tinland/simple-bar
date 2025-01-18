import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

export async function goToSpace(index) {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m space --focus ${index}`);
}

export async function renameSpace(index, label) {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m space ${index} --label "${label}"`);
}

export async function createSpace(displayId) {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`);
  await Uebersicht.run(`${yabaiPath} -m space --create`);
  await Utils.softRefresh();
}

export async function removeSpace(index, displayId) {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`);
  await Uebersicht.run(`${yabaiPath} -m space ${index} --destroy`);
  await Utils.softRefresh();
}

export async function swapSpace(index, direction) {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  const action = direction === "left" ? index - 1 : index + 1;
  await Uebersicht.run(`${yabaiPath} -m space ${index} --swap ${action}`);
  await Utils.softRefresh();
}

export async function focusWindow(id) {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  await Uebersicht.run(`${yabaiPath} -m window --focus ${id}`);
}

export async function getSpaces() {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  const json = await Uebersicht.run(`${yabaiPath} -m query --spaces`);
  return Utils.parseJson(json);
}

export async function getWindows() {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  const json = await Uebersicht.run(`${yabaiPath} -m query --windows`);
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

export async function getDisplays() {
  const settings = Settings.get();
  const { yabaiPath = "/usr/local/bin/yabai" } = settings.global;
  const json = await Uebersicht.run(`${yabaiPath} -m query --displays`);
  return Utils.parseJson(json);
}
