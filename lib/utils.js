import { run } from 'uebersicht'

export const parseJson = (json) => {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.log(error, json)
    return
  }
}

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
var hasOwn = {}.hasOwnProperty

export function classnames() {
  var classes = []

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    if (!arg) continue

    var argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg) && arg.length) {
      var inner = classnames.apply(null, arg)
      if (inner) {
        classes.push(inner)
      }
    } else if (argType === 'object') {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}

export const getTheme = (settings) => {
  if (!settings) return 'dark'
  const selectedTheme = settings.global.theme
  if (selectedTheme === 'auto') {
    const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return isDarkMode() ? 'dark' : 'light'
  }
  return selectedTheme
}

export const getActiveWidgets = (settings) => {
  const { widgets } = settings

  const activeWidgets = Object.keys(widgets)
    .reduce((acc, key) => {
      const widget = widgets[key]
      return widget ? [...acc, key] : acc
    }, [])
    .join(' ')

  return activeWidgets
}

const WIDTH = 20
const DURATION = 320

export const clickEffect = (e) => {
  const { body } = document
  const { clientX: x, clientY: y } = e
  const theme = getTheme()
  const color = theme === 'dark' ? '255' : '0'
  const cursor = document.createElement('div')
  Object.assign(cursor.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: `${WIDTH}px`,
    height: `${WIDTH}px`,
    backgroundColor: `rgba(${color}, ${color}, ${color}, 0.3)`,
    borderRadius: '50%',
    zIndex: 2147483647,
    opacity: 0,
    transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(0)`,
    pointerEvents: 'none',
    touchAction: 'none',
    transition: `transform ${DURATION} ease`
  })
  if (cursor && 'animate' in cursor) {
    body.appendChild(cursor)
    cursor.animate(
      [
        { opacity: 0, transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(0)` },
        { opacity: 1, transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(2)` },
        { opacity: 0, transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(1.6)` }
      ],
      { duration: DURATION }
    )
  }
  setTimeout(() => cursor && body.removeChild(cursor), DURATION)
}

const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item)

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

export const filterApps = (app, exclusions, titleExclusions) => {
  const { 'native-fullscreen': fullscreen, app: appName, title: appTitle } = app
  const isAppNameExcluded = exclusions.includes(appName)
  const isAppTitleExcluded = titleExclusions.includes(appTitle)
  return fullscreen === 1 || (!isAppNameExcluded && appTitle === '') || (!isAppNameExcluded && !isAppTitleExcluded)
}

export const refreshData = () => {
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-data-jsx"'`)
}

export const refreshProcess = () => {
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-process-jsx"'`)
}

export const refreshSpaces = () => {
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-jsx"'`)
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-2-jsx"'`)
}

export const refreshSimpleBar = () => run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh'`)

export const notification = (content, title = 'simple-bar') => {
  run(`osascript -e 'tell app "System Events" to display notification "${content}" with title "${title}"'`)
}
