import * as Uebersicht from 'uebersicht'
import * as Settings from './settings'

export const parseJson = (json) => {
  try {
    return JSON.parse(json)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error, json)
    return undefined
  }
}

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
const hasOwn = {}.hasOwnProperty

export function classnames() {
  const classes = []

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (!arg) continue

    const argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg) && arg.length) {
      const inner = classnames.apply(null, arg)
      if (inner) {
        classes.push(inner)
      }
    } else if (argType === 'object') {
      for (const key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}

const WIDTH = 20
const DURATION = 320

export const clickEffect = (e) => {
  const { body } = document
  const { clientX, clientY } = e
  const cursor = Object.assign(document.createElement('div'), { id: 'simple-bar-click-effect' })
  Object.assign(cursor.style, {
    top: `${clientY - WIDTH / 2}px`,
    left: `${clientX - WIDTH / 2}px`,
    width: `${WIDTH}px`,
    height: `${WIDTH}px`,
    transition: `transform ${DURATION} ease`
  })
  if (cursor && 'animate' in cursor) {
    body.appendChild(cursor)
    cursor.animate(
      [
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(2)' },
        { opacity: 0, transform: 'scale(1.6)' }
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

/*!
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 */
export const compareObjects = (obj1, obj2) => {
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1
  }
  const diffs = {}
  let key
  const arraysMatch = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }
    return true
  }
  const compare = (item1, item2, key) => {
    const type1 = Object.prototype.toString.call(item1)
    const type2 = Object.prototype.toString.call(item2)
    if (type2 === '[object Undefined]') {
      diffs[key] = null
      return
    }
    if (type1 !== type2) {
      diffs[key] = item2
      return
    }
    if (type1 === '[object Object]') {
      const objDiff = compareObjects(item1, item2)
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff
      }
      return
    }
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2
      }
      return
    }
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2
      }
    }
  }
  for (key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      compare(obj1[key], obj2[key], key)
    }
  }
  for (key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key]
      }
    }
  }
  return diffs
}

export const filterApps = (app, exclusions, titleExclusions, exclusionsAsRegex) => {
  const { 'native-fullscreen': fullscreen, app: appName, title: appTitle } = app
  const isAppNameExcluded = exclusionsAsRegex
    ? exclusions.length !== 0 && new RegExp(exclusions).test(appName)
    : exclusions.includes(appName)
  const isAppTitleExcluded = exclusionsAsRegex
    ? titleExclusions.length !== 0 && new RegExp(titleExclusions).test(appTitle)
    : titleExclusions.includes(appTitle)
  return fullscreen === 1 || (!isAppNameExcluded && !appTitle.length) || (!isAppNameExcluded && !isAppTitleExcluded)
}

export const stickyWindowWorkaround = (
  windows,
  uniqueApps,
  currentDisplay,
  currentSpace,
  exclusions,
  titleExclusions,
  exclusionsAsRegex
) => {
  const stickySet = new Set()
  const stickyWindows = windows.filter(
    (app) =>
      app.sticky === 1 &&
      app['native-fullscreen'] === 0 &&
      app.display === currentDisplay &&
      filterApps(app, exclusions, titleExclusions, exclusionsAsRegex) &&
      !stickySet.has(uniqueApps ? app.app : app.id) &&
      stickySet.add(uniqueApps ? app.app : app.id)
  )
  const nonStickySet = new Set()
  const nonStickyWindows = windows.filter(
    (app) =>
      (app.sticky === 0 || app['native-fullscreen'] === 1) &&
      app.space === currentSpace &&
      filterApps(app, exclusions, titleExclusions, exclusionsAsRegex) &&
      !nonStickySet.has(uniqueApps ? app.app : app.id) &&
      nonStickySet.add(uniqueApps ? app.app : app.id)
  )
  return { nonStickyWindows, stickyWindows }
}

export const sortWindows = (windows) =>
  windows.sort((a, b) => {
    if (a.frame.x !== b.frame.x) return a.frame.x > b.frame.x
    if (a.frame.y !== b.frame.y) return a.frame.y > b.frame.y
    if (a['stack-index'] !== b['stack-index']) return a['stack-index'] > b['stack-index']
    return a.id > b.id
  })

export const refreshSpaces = () =>
  Uebersicht.run(
    `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-jsx"'`
  )

export const hardRefresh = () => Uebersicht.run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh'`)

export const notification = (content, title = 'simple-bar') => {
  const settings = Settings.get()
  const { disableNotifications } = settings.global
  if (disableNotifications) return
  Uebersicht.run(`osascript -e 'tell app "System Events" to display notification "${content}" with title "${title}"'`)
}

export const injectStyles = (id, styles) => {
  const existingStyles = document.getElementById(id)
  if (existingStyles) return (existingStyles.innerHTML = styles.join(''))
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      id,
      innerHTML: styles.join('')
    })
  )
}

export const startSliding = (container, innerSelector, sliderSelector) => {
  if (!container) return
  const settings = Settings.get()
  const { slidingAnimationPace } = settings.global
  const pace = !slidingAnimationPace?.trim().length || slidingAnimationPace === '0' ? 4 : parseInt(slidingAnimationPace)
  const inner = container.querySelector(innerSelector)
  const slider = container.querySelector(sliderSelector)
  const delta = inner.clientWidth - slider.clientWidth
  if (delta > 0) return
  const timing = Math.round((Math.abs(delta) * 100) / pace)
  Object.assign(slider.style, {
    transform: `translateX(${delta}px)`,
    transition: `transform ${timing}ms linear`
  })
}

export const stopSliding = (container, sliderSelector) => {
  if (!container) return
  container.querySelector(sliderSelector).removeAttribute('style')
}

export const cleanupOutput = (output) => output?.trim().replace(/(\r\n|\n|\r)/gm, '')
