import * as Uebersicht from "uebersicht";
import * as Settings from "./settings";

export function parseJson(json) {
  try {
    return JSON.parse(json);
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

export function filterApps(
  app,
  exclusions,
  titleExclusions,
  exclusionsAsRegex
) {
  const {
    "is-native-fullscreen": isNativeFullscreen,
    "native-fullscreen": __legacyIsNativeFullscreen,
    app: appName,
    title: appTitle,
  } = app;

  const isAppNameExcluded = exclusionsAsRegex
    ? exclusions.length !== 0 && new RegExp(exclusions).test(appName)
    : exclusions.includes(appName);

  const isAppTitleExcluded = exclusionsAsRegex
    ? titleExclusions.length !== 0 && new RegExp(titleExclusions).test(appTitle)
    : titleExclusions.includes(appTitle);

  return (
    (isNativeFullscreen ?? __legacyIsNativeFullscreen) ||
    (!isAppNameExcluded && !appTitle.length) ||
    (!isAppNameExcluded && !isAppTitleExcluded)
  );
}

export function isSpaceExcluded(id, exclusions, exclusionsAsRegex) {
  const isSpaceNameExcluded = exclusionsAsRegex
    ? exclusions.length !== 0 && new RegExp(exclusions).test(id)
    : exclusions.includes(id);

  return exclusions && isSpaceNameExcluded;
}

// TODO: simplify this
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

export function sortWindows(windows) {
  return windows.sort((a, b) => {
    if (a.frame.x !== b.frame.x) return a.frame.x > b.frame.x;
    if (a.frame.y !== b.frame.y) return a.frame.y > b.frame.y;
    if (a["stack-index"] !== b["stack-index"])
      return a["stack-index"] > b["stack-index"];
    return a.id > b.id;
  });
}

export async function softRefresh() {
  await Uebersicht.run(
    `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-index-jsx"'`
  );
}

export async function hardRefresh() {
  await Uebersicht.run(
    `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh'`
  );
}

export function notification(content, title = "simple-bar") {
  const settings = Settings.get();
  const { disableNotifications } = settings.global;
  if (disableNotifications) return;
  Uebersicht.run(
    `osascript -e 'tell app "System Events" to display notification "${content}" with title "${title}"'`
  );
}

export function injectStyles(id, styles = []) {
  const existingStyles = document.getElementById(id);
  const stylesToInject = styles.join("");
  if (existingStyles) return (existingStyles.innerHTML = stylesToInject);
  document.head.appendChild(
    Object.assign(document.createElement("style"), {
      id,
      innerHTML: stylesToInject,
    })
  );
}

const DEFAULT_PACE = 4;

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

export function stopSliding(container, sliderSelector) {
  if (!container) return;
  container.querySelector(sliderSelector).removeAttribute("style");
}

export function cleanupOutput(output) {
  return output?.trim().replace(/(\r\n|\n|\r)/gm, "");
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export function handleBarFocus() {
  const bar = document.querySelector(".simple-bar");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    if (e.target !== bar) return;
    focusBar();
  });
  bar.addEventListener("mouseleave", blurBar);
}

function focusBar() {
  const bar = document.querySelector(".simple-bar");
  if (!bar) return;
  bar.classList.add("simple-bar--focused");
}

export function blurBar() {
  const bar = document.querySelector(".simple-bar");
  if (!bar) return;
  bar.classList.remove("simple-bar--focused");
}

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

export function isVisibleOnDisplay(display, setting) {
  try {
    if (!setting?.trim()) return true;
    const displays = setting.split(",").map((d) => parseInt(d, 10));
    return displays.includes(display);
  } catch (e) {
    return true;
  }
}

export function addToGraphHistory(value, setGraph, maxLength) {
  setGraph((graph) => {
    const newGraph = [...graph, value];
    if (newGraph.length > maxLength) {
      newGraph.shift();
    }
    return newGraph;
  });
}

export function getRefreshFrequency(value, defaultValue) {
  const parsedValue = parseInt(value, 10);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

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
