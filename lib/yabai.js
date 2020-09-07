import { run } from 'uebersicht'

const refreshSpaces = () => {
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-jsx"'`)
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-2-jsx"'`)
}

export const goToSpace = (index, focusedSpace) => {
  if (index === focusedSpace) return
  run(`/usr/local/bin/yabai -m space --focus ${index}`)
}

export const createSpace = () => run('/usr/local/bin/yabai -m space --create')

export const removeSpace = (index, focusedSpace) => {
  if (focusedSpace !== index) {
    goToSpace(index)
    run('/usr/local/bin/yabai -m space --destroy').then(() => goToSpace(focusedSpace))
  } else {
    run('/usr/local/bin/yabai -m space --destroy')
  }
}

export const swapSpace = (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  run(`/usr/local/bin/yabai -m space ${index} --swap ${action}`)
    .then(refreshSpaces)
    .then(() => document.activeElement.blur())
}
