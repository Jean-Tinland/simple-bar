import { run } from 'uebersicht'

const refreshSpaces = () => {
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-jsx"'`)
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-2-jsx"'`)
}

export const goToSpace = (index, focusedSpace) => {
  if (index === focusedSpace) return
  run(`/usr/local/bin/yabai -m space --focus ${index}`)
}

export const createSpace = (index) => () =>
  run('/usr/local/bin/yabai -m space --create').then(() => goToSpace(index + 1))

export const removeSpace = (index, focusedSpace) => {
  if (focusedSpace !== index) {
    goToSpace(index)
    run('/usr/local/bin/yabai -m space --destroy').then(() => goToSpace(focusedSpace))
  } else {
    run('/usr/local/bin/yabai -m space --destroy')
  }
}

export const swapSpace = (index, direction) => {
  if (direction === 'left') {
    run(`/usr/local/bin/yabai -m space ${index} --swap ${index - 1}`)
      .then(refreshSpaces)
      .then(() => document.activeElement.blur())
  }
  if (direction === 'right') {
    run(`/usr/local/bin/yabai -m space ${index} --swap ${index + 1}`)
      .then(refreshSpaces)
      .then(() => document.activeElement.blur())
  }
}
