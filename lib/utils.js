import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";

/**
 * Parses a JSON string and returns the corresponding JavaScript object.
 * Cleans up JSON that contains escape sequences, such as `\\` or `\"`.
 *
 * @param {string} json - The JSON string to parse.
 * @returns {Object|undefined} The parsed JavaScript object, or undefined if parsing fails.
 */
export function parseJson(json) {
  try {
    // clean up JSON with escape sequences, (i.e.)
    // empty arrays: [,] -> []
    // escape sequences: \\" -> "
    let cleanedJson = json
      .replace(/\[,+/g, "[")
      .replace(/,+\]/g, "]")
      .replace(/,+,/g, ",")
      .replace(/\[,/g, "[")
      .replace(/,\]/g, "]")
      .replace(/\\/g, "\\\\")
      .replace(/\\"/g, '"');
    return JSON.parse(cleanedJson);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, json);
    return undefined;
  }
}

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
const hasOwn = {}.hasOwnProperty;

/**
 * Combines multiple class names into a single string.
 *
 * @param {...(string|boolean|undefined|null)} arguments - The class names to combine.
 * Each argument can be a string, boolean, undefined, or null. Only truthy values will be included.
 * @returns {string} The combined class names.
 */
export function classNames() {
  let classes = "";

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (arg) {
      classes = appendClass(classes, parseValue(arg));
    }
  }

  return classes;
}

function parseValue(arg) {
  if (typeof arg === "string" || typeof arg === "number") {
    return arg;
  }
  if (typeof arg !== "object") {
    return "";
  }
  if (Array.isArray(arg)) {
    return classNames.apply(null, arg);
  }
  if (
    arg.toString !== Object.prototype.toString &&
    !arg.toString.toString().includes("[native code]")
  ) {
    return arg.toString();
  }

  let classes = "";
  for (let key in arg) {
    if (hasOwn.call(arg, key) && arg[key]) {
      classes = appendClass(classes, key);
    }
  }
  return classes;
}

function appendClass(value, newClass) {
  if (!newClass) {
    return value;
  }
  if (value) {
    return value + " " + newClass;
  }
  return value + newClass;
}
/*!
  End of Jed Watson's classNames
*/

const WIDTH = 20;
const DURATION = 320;

/**
 * Creates a click effect animation at the location of the mouse click event.
 *
 * @param {MouseEvent} e - The mouse event object containing the click coordinates.
 */
export function clickEffect(e) {
  const { body } = document;
  const { clientX, clientY } = e;
  const cursor = Object.assign(document.createElement("div"), {
    id: "simple-bar-click-effect",
  });
  Object.assign(cursor.style, {
    top: `${clientY - WIDTH / 2}px`,
    left: `${clientX - WIDTH / 2}px`,
    width: `${WIDTH}px`,
    height: `${WIDTH}px`,
    transition: `transform ${DURATION} ease`,
  });
  if (cursor && "animate" in cursor) {
    body.appendChild(cursor);
    cursor.animate(
      [
        { opacity: 0, transform: "scale(0)" },
        { opacity: 1, transform: "scale(2)" },
        { opacity: 0, transform: "scale(1.6)" },
      ],
      { duration: DURATION }
    );
  }
  setTimeout(() => cursor && body.removeChild(cursor), DURATION);
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deeply merges multiple source objects into a target object.
 *
 * @param {Object} target - The target object to merge properties into.
 * @param {...Object} sources - One or more source objects to merge properties from.
 * @returns {Object} - The target object after merging.
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

/*!
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 */
/**
 * Compares two objects and returns the differences.
 *
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @returns {Object} An object containing the differences between obj1 and obj2.
 *
 * @example
 * const obj1 = { a: 1, b: 2, c: 3 };
 * const obj2 = { a: 1, b: 4, d: 5 };
 * const diffs = compareObjects(obj1, obj2);
 * // diffs = { b: 4, c: null, d: 5 }
 */
export function compareObjects(obj1, obj2) {
  if (!obj2 || Object.prototype.toString.call(obj2) !== "[object Object]") {
    return obj1;
  }
  const diffs = {};
  let key;
  const arraysMatch = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };
  const compare = (item1, item2, key) => {
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);
    if (type2 === "[object Undefined]") {
      diffs[key] = null;
      return;
    }
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }
    if (type1 === "[object Object]") {
      const objDiff = compareObjects(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }
    if (type1 === "[object Array]") {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }
    if (type1 === "[object Function]") {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }
  };
  for (key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      compare(obj1[key], obj2[key], key);
    }
  }
  for (key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }
  return diffs;
}

/**
 * Filters applications based on provided exclusions and title exclusions.
 *
 * @param {Object} app - The application object to be filtered.
 * @param {Array<string>} exclusions - List of application names to be excluded.
 * @param {Array<string>} titleExclusions - List of application titles to be excluded.
 * @param {boolean} exclusionsAsRegex - Flag indicating if exclusions should be treated as regular expressions.
 * @returns {boolean} - Returns true if the application should be included, false otherwise.
 */
export function filterApps(
  app,
  exclusions,
  titleExclusions,
  exclusionsAsRegex
) {
  const fullscreen = app.isNativeFullscreen ?? app.__legacyIsNativeFullscreen;
  const appName = app.app || app["app-name"];
  const appTitle = app.title || app["window-title"];

  const isAppNameExcluded = exclusionsAsRegex
    ? exclusions.length !== 0 && new RegExp(exclusions).test(appName)
    : exclusions.includes(appName);

  const isAppTitleExcluded = exclusionsAsRegex
    ? titleExclusions.length !== 0 && new RegExp(titleExclusions).test(appTitle)
    : titleExclusions.includes(appTitle);

  return (
    fullscreen ||
    (!isAppNameExcluded && !appTitle?.length) ||
    (!isAppNameExcluded && !isAppTitleExcluded)
  );
}

export function isSpaceExcluded(id, exclusions /*list*/, exclusionsAsRegex) {
  const isSpaceNameExcluded = exclusionsAsRegex
    ? exclusions.some(
        (rx) =>
          rx.length !== 0 &&
          (rx instanceof RegExp ? rx : new RegExp(rx)).test(id)
      )
    : exclusions.includes(id);

  return exclusions && isSpaceNameExcluded;
}

/**
 * Filters and categorizes windows into sticky and non-sticky based on various criteria.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.windows - The list of windows to filter.
 * @param {boolean} params.uniqueApps - Whether to treat apps as unique.
 * @param {number} params.currentDisplay - The current display identifier.
 * @param {number} params.currentSpace - The current space identifier.
 * @param {Array} params.exclusions - The list of app names to exclude.
 * @param {Array} params.titleExclusions - The list of window titles to exclude.
 * @param {boolean} params.exclusionsAsRegex - Whether exclusions are regex patterns.
 * @returns {Object} An object containing two arrays: `nonStickyWindows` and `stickyWindows`.
 */
export function stickyWindowWorkaround({
  windows = [],
  uniqueApps,
  currentDisplay,
  currentSpace,
  exclusions,
  titleExclusions,
  exclusionsAsRegex,
}) {
  const stickySet = new Set();
  const stickyWindows = windows.filter((app) => {
    const {
      "is-sticky": isSticky,
      sticky: __legacyIsSticky,
      "is-native-fullscreen": isNativeFullscreen,
      "native-fullscreen": __legacyIsNativeFullscreen,
      display,
      app: appName,
      id,
    } = app;
    return (
      (isSticky ?? __legacyIsSticky) &&
      !(isNativeFullscreen ?? __legacyIsNativeFullscreen) &&
      display === currentDisplay &&
      filterApps(app, exclusions, titleExclusions, exclusionsAsRegex) &&
      !stickySet.has(uniqueApps ? appName : id) &&
      stickySet.add(uniqueApps ? appName : id)
    );
  });
  const nonStickySet = new Set();
  const nonStickyWindows = windows.filter((app) => {
    const {
      "is-sticky": isSticky,
      sticky: __legacyIsSticky,
      "is-native-fullscreen": isNativeFullscreen,
      "native-fullscreen": __legacyIsNativeFullscreen,
      space,
      app: appName,
      id,
    } = app;
    return (
      (!(isSticky ?? __legacyIsSticky) ||
        (isNativeFullscreen ?? __legacyIsNativeFullscreen)) &&
      space === currentSpace &&
      filterApps(app, exclusions, titleExclusions, exclusionsAsRegex) &&
      !nonStickySet.has(uniqueApps ? appName : id) &&
      nonStickySet.add(uniqueApps ? appName : id)
    );
  });
  return { nonStickyWindows, stickyWindows };
}

/**
 * Sorts an array of window objects based on their frame coordinates and stack index.
 *
 * The sorting priority is as follows:
 * 1. `frame.x` - Windows are sorted by their x-coordinate.
 * 2. `frame.y` - If x-coordinates are equal, windows are sorted by their y-coordinate.
 * 3. `stack-index` - If both x and y coordinates are equal, windows are sorted by their stack index.
 * 4. `id` - If all previous criteria are equal, windows are sorted by their id.
 *
 * @param {Array} windows - The array of window objects to be sorted.
 * @param {Object} windows[].frame - The frame object containing x and y coordinates.
 * @param {number} windows[].frame.x - The x-coordinate of the window.
 * @param {number} windows[].frame.y - The y-coordinate of the window.
 * @param {number} windows[].stack-index - The stack index of the window.
 * @param {number} windows[].id - The unique identifier of the window.
 * @returns {Array} The sorted array of window objects.
 */
export function sortWindows(windows) {
  return windows.sort((a, b) => {
    if (a.frame.x !== b.frame.x) {
      return a.frame.x > b.frame.x;
    }
    if (a.frame.y !== b.frame.y) {
      return a.frame.y > b.frame.y;
    }
    if (a["stack-index"] !== b["stack-index"]) {
      return a["stack-index"] > b["stack-index"];
    }
    return a.id > b.id;
  });
}

/**
 * Softly refreshes the Uebersicht widget with the specified ID.
 *
 * This function runs an AppleScript command to refresh the widget with the ID "simple-bar-index-jsx"
 * in the Uebersicht application.
 *
 * @async
 * @function softRefresh
 * @returns {Promise<void>} A promise that resolves when the refresh command has been executed.
 */
export async function softRefresh() {
  await Uebersicht.run(
    `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-index-jsx"'`
  );
}

/**
 * Triggers a hard refresh of the Uebersicht application by running an AppleScript command.
 *
 * @async
 * @function hardRefresh
 * @returns {Promise<void>} A promise that resolves when the refresh command has been executed.
 */
export async function hardRefresh() {
  await Uebersicht.run(
    `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh'`
  );
}

/**
 * Displays a notification using either the pushMissive function or the system notification.
 *
 * @param {string} content - The content of the notification.
 * @param {Function} pushMissive - A function to push a missive notification.
 * @param {Object} [options] - Optional settings for the notification.
 * @param {string} [options.side="right"] - The side where the notification should appear.
 * @param {number} [options.delay=5000] - The delay before the notification disappears.
 */
export function notification(
  content,
  pushMissive,
  { side = "right", delay = 5000 } = {}
) {
  const settings = Settings.get();
  const { disableNotifications, enableMissives } = settings.global;
  if (disableNotifications) return;
  if (enableMissives && typeof pushMissive === "function") {
    pushMissive({ side, content, delay });
  } else {
    Uebersicht.run(
      `osascript -e 'tell app "System Events" to display notification "${content}" with title "simple-bar"'`
    );
  }
}

/**
 * Injects styles into the document head. If styles with the given ID already exist, it updates them.
 * Otherwise, it creates a new style element and appends it to the document head.
 *
 * @param {string} id - The ID to assign to the style element.
 * @param {string[]} [styles=[]] - An array of CSS styles to inject.
 */
export function injectStyles(id, styles = []) {
  const existingStyles = document.getElementById(id);
  // Merge all styles and minify them
  const stylesToInject = styles.join("").replace(/\s+/g, " ");
  if (existingStyles) {
    existingStyles.innerHTML = stylesToInject;
    return;
  }
  document.head.appendChild(
    Object.assign(document.createElement("style"), {
      id,
      innerHTML: stylesToInject,
    })
  );
}

const DEFAULT_PACE = 4;

/**
 * Starts the sliding animation for a given container.
 *
 * @param {HTMLElement} container - The container element that holds the inner and slider elements.
 * @param {string} innerSelector - The CSS selector for the inner element.
 * @param {string} sliderSelector - The CSS selector for the slider element.
 */
export function startSliding(container, innerSelector, sliderSelector) {
  if (!container) return;
  const settings = Settings.get();
  const { slidingAnimationPace = DEFAULT_PACE } = settings.global;
  const pace =
    !slidingAnimationPace || slidingAnimationPace < 1
      ? DEFAULT_PACE
      : parseInt(slidingAnimationPace);
  const inner = container.querySelector(innerSelector);
  const slider = container.querySelector(sliderSelector);
  const delta = inner.clientWidth - slider.clientWidth;
  if (delta > 0) return;
  const timing = Math.round((Math.abs(delta) * 100) / pace);
  Object.assign(slider.style, {
    transform: `translateX(${delta}px)`,
    transition: `transform ${timing}ms linear`,
  });
}

/**
 * Stops the sliding effect by removing the inline style of the slider element.
 *
 * @param {HTMLElement} container - The container element that holds the slider.
 * @param {string} sliderSelector - The CSS selector for the slider element.
 */
export function stopSliding(container, sliderSelector) {
  if (!container) return;
  container.querySelector(sliderSelector).removeAttribute("style");
}

/**
 * Cleans up the given output by trimming whitespace and removing all newline characters.
 *
 * @param {string} output - The string output to be cleaned.
 * @returns {string} - The cleaned output string.
 */
export function cleanupOutput(output) {
  return output?.trim().replace(/(\r\n|\n|\r)/gm, "");
}

/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to wait before the promise resolves.
 * @returns {Promise<void>} An empty promise that resolves after the specified delay.
 */
export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Switches the space (virtual desktop) on macOS.
 *
 * @param {number} currentIndex - The current space index.
 * @param {number} desiredIndex - The desired space index to switch to.
 * @returns {Promise<void>} A promise that resolves when the space switch is complete.
 */
export async function switchSpace(currentIndex, desiredIndex) {
  const repeats = Math.abs(currentIndex - desiredIndex);
  const left = currentIndex > desiredIndex;
  for (let i = 0; i < repeats; i++) {
    await Uebersicht.run(
      `osascript -e 'tell app "System Events" to key code ${
        left ? "123" : "124"
      } using control down'`
    );
  }
}

/**
 * Adds event listeners to handle focus and blur events on the bar element.
 *
 * This function selects the element with the class "simple-bar" and adds
 * event listeners for "click" and "mouseleave" events. When the bar is clicked,
 * it checks if the click target is the bar itself and then calls the `focusBar` function.
 * When the mouse leaves the bar, it calls the `blurBar` function.
 */
export function handleBarFocus() {
  const bar = document.querySelector(".simple-bar");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    if (e.target !== bar) return;
    focusBar();
  });
  bar.addEventListener("mouseleave", blurBar);
}

/**
 * Focuses the bar element by adding the "simple-bar--focused" class to it.
 * If the bar element is not found, the function does nothing.
 */
function focusBar() {
  const bar = document.querySelector(".simple-bar");
  if (!bar) return;
  bar.classList.add("simple-bar--focused");
}

/**
 * Removes the "simple-bar--focused" class from the element with the class "simple-bar".
 * If the element is not found, the function does nothing.
 */
export function blurBar() {
  const bar = document.querySelector(".simple-bar");
  if (!bar) return;
  bar.classList.remove("simple-bar--focused");
}

/**
 * Retrieves the system architecture.
 *
 * This function runs two shell commands using Uebersicht to get the system's
 * architecture and system type. It then processes the output to determine
 * if the system is using an ARM64 architecture or x86_64.
 *
 * @returns {Promise<"arm64" | "x86_64">} A promise that resolves to a string indicating the system architecture ("arm64" or "x86_64").
 */
export async function getSystem() {
  const [bareArchitecture, bareSystem] = await Promise.all([
    Uebersicht.run("uname -a"),
    Uebersicht.run("uname -m"),
  ]);
  const architecture = cleanupOutput(bareArchitecture);
  const system = cleanupOutput(bareSystem);
  if (
    system.startsWith("arm64") ||
    (system.startsWith("x86_64") && architecture.includes("ARM64"))
  ) {
    return "arm64";
  }
  return "x86_64";
}

/**
 * Checks if a display is visible based on the provided setting.
 *
 * @param {number} display - The display number to check.
 * @param {string} setting - A comma-separated string of display numbers.
 * @returns {boolean} - Returns true if the display is visible, otherwise false.
 */
export function isVisibleOnDisplay(display, setting) {
  try {
    if (!setting?.trim()) return true;
    const displays = setting.split(",").map((d) => parseInt(d, 10));
    return displays.includes(display);
  } catch {
    return true;
  }
}

/**
 * Adds a value to the graph history and ensures the graph does not exceed the specified maximum length.
 *
 * @param {any} value - The value to add to the graph history.
 * @param {function} setGraph - The state setter function for updating the graph.
 * @param {number} maxLength - The maximum length of the graph history.
 */
export function addToGraphHistory(value, setGraph, maxLength) {
  setGraph((graph) => {
    const newGraph = [...graph, value];
    if (newGraph.length > maxLength) {
      newGraph.shift();
    }
    return newGraph;
  });
}

/**
 * Parses a string value into an integer and returns it if valid, otherwise returns a default value.
 *
 * @param {string} value - The string value to parse.
 * @param {number} defaultValue - The default value to return if parsing fails.
 * @returns {number} - The parsed integer or the default value if parsing fails.
 */
export function getRefreshFrequency(value, defaultValue) {
  const parsedValue = parseInt(value, 10);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

/**
 * Executes a given command in the user's preferred terminal application.
 *
 * The terminal application is determined by the global settings.
 * Supported terminals are "Terminal" and "iTerm2".
 *
 * @param {string} command - The command to be executed in the terminal.
 */
export function runInUserTerminal(command) {
  const settings = Settings.get();
  const { terminal } = settings.global;
  switch (terminal) {
    case "Terminal":
      Uebersicht.run(
        `osascript ./simple-bar/lib/scripts/run-command-in-terminal.applescript` +
          ` "${command}"`
      );
      break;
    case "iTerm2":
      Uebersicht.run(
        `osascript ./simple-bar/lib/scripts/run-command-in-iterm2.applescript` +
          ` "${command}"`
      );
      break;
    default:
      break;
  }
}

/**
 * Formats a given number of bytes into a more readable string with appropriate units.
 *
 * @param {number} bytes - The number of bytes to format.
 * @param {number} [decimals=1] - The number of decimal places to include in the formatted string.
 * @returns {string} The formatted string with the appropriate unit.
 */
export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return "0b";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["b", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}<em>${
    sizes[i]
  }</em>`;
}
