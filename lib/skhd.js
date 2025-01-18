import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";
import * as Utils from "./utils";

export async function getMode() {
  const settings = Settings.get();
  const { shell } = settings.global;
  const mode = await Uebersicht.run(
    `cat $(${shell} ./simple-bar/lib/scripts/yabai-set-mode-server.sh --query 2>&1)`
  );
  return Utils.parseJson(mode);
}
