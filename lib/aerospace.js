import * as Uebersicht from "uebersicht";
import * as Utils from "./utils";

export async function goToSpace(index) {
  await Uebersicht.run(`$(which aerospace) workspace ${index}`);
}

export async function focusWindow(id) {
  await Uebersicht.run(`$(which aerospace) focus --window-id ${id}`);
}

export async function getSpaces(displayId) {
  const json = await Uebersicht.run(
    `$(which aerospace) list-workspaces --monitor ${displayId} --json --format "%{monitor-appkit-nsscreen-screens-id} %{workspace}"`
  );
  return Utils.parseJson(json);
}

export async function getFocusedSpace() {
  const json = await Uebersicht.run(
    `$(which aerospace) list-workspaces --focused --json`
  );
  return Utils.parseJson(json);
}

export async function getWindows(workspaceId) {
  const json = await Uebersicht.run(
    `$(which aerospace) list-windows --workspace ${workspaceId} --json`
  );
  const cleanedJson = json.replace(/\\\n/g, "").replace(/00000/g, "0");
  return Utils.parseJson(cleanedJson);
}

export async function getFocusedWindow() {
  const json = await Uebersicht.run(
    `$(which aerospace) list-windows --focused --json`
  );
  return Utils.parseJson(json);
}

export async function getDisplays() {
  const json = await Uebersicht.run(`$(which aerospace) list-monitors --json`);
  return Utils.parseJson(json);
}
