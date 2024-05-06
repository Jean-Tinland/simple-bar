import * as Settings from "./settings/settings.jsx";
import * as Utils from "../utils";

const message = {
  error: "Something went wrong...",
  yabaiError: "yabai is not running",
  noOutput: "Loading...",
  noData: "JSON error...",
};

export function Component({ type, classes }) {
  const errorClasses = Utils.classNames("simple-bar--empty", classes, {
    "simple-bar--loading": type === "noOutput",
  });

  if (type === "error" || type === "noData") {
    setTimeout(Utils.softRefresh, 2000);
  }

  if (type === "yabaiError") {
    setTimeout(Utils.softRefresh, 15000);
  }

  return (
    <div className={errorClasses}>
      <span>simple-bar-index.jsx: {message[type]}</span>
      <Settings.Wrapper />
    </div>
  );
}
