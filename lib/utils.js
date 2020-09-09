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

const WIDTH = 20
const DURATION = 320

export const clickEffect = (e) => {
  const { body } = document
  const { clientX: x, clientY: y } = e
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const color = isDarkMode ? '255' : '0'
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
  body.appendChild(cursor)
  cursor.animate(
    [
      { opacity: 0, transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(0)` },
      { opacity: 1, transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(2)` },
      { opacity: 0, transform: `translate(${x - WIDTH / 2}px, ${y - WIDTH / 2}px) scale(1.6)` }
    ],
    { duration: DURATION }
  )
  setTimeout(() => body.removeChild(cursor), DURATION)
}
