import * as Settings from "./settings/settings.jsx";
import * as Utils from "../utils";

// Error messages for different types of errors
const message = {
  error: "Something went wrong…",
  yabaiError: "yabai is not running",
  aerospaceError: "AeroSpace is either not running or outdated",
  flashspaceError: "Flashspace is not installed or missconfigured",
  noOutput: "Loading…",
  noData: "JSON error…",
};

/**
 * Component to display error messages based on the type of error.
 * @param {Object} props - The properties object.
 * @param {string} props.type - The type of error.
 * @param {string} props.classes - Additional CSS classes.
 * @returns {JSX.Element} The error component.
 */
export function Component({ type, classes }) {
  // Combine base class with additional classes and conditional loading class
  const errorClasses = Utils.classNames("simple-bar--empty", classes, {
    "simple-bar--loading": type === "noOutput",
  });

  // Refresh the component after 2 seconds for general errors and JSON errors
  if (type === "error" || type === "noData") {
    setTimeout(Utils.softRefresh, 2000);
  }

  // Refresh the component after 15 seconds for yabai and aerospace errors
  if (
    type === "yabaiError" ||
    type === "aerospaceError" ||
    type === "flashspaceError"
  ) {
    setTimeout(Utils.softRefresh, 15000);
  }

  return (
    <div className={errorClasses}>
      <span>simple-bar-index.jsx: {message[type]}</span>
      <Settings.Wrapper />
    </div>
  );
}
