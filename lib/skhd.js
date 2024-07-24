import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

const settings = Settings.get();

const { shell } = settings.global;

export async function getMode() {
  const mode = await Uebersicht.run(
    `cat $(${shell} ./simple-bar/lib/scripts/yabai-set-mode-server.sh --query 2>&1)`
  );
  return Utils.parseJson(mode);
}
