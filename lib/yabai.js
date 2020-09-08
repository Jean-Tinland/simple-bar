import { run } from 'uebersicht'

const refreshSpaces = () => {
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-jsx"'`)
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-spaces-2-jsx"'`)
}

export const goToSpace = async (index, focusedSpace) => {
  if (index === focusedSpace) return
  await run(`/usr/local/bin/yabai -m space --focus ${index}`)
}

export const createSpace = (displayId) => () => {
  run(`/usr/local/bin/yabai -m display --focus ${displayId}`).then(() => {
    run('/usr/local/bin/yabai -m space --create').then(refreshSpaces)
  })
}

export const removeSpace = (index, focusedSpace, displayId) => {
  run(`/usr/local/bin/yabai -m display --focus ${displayId}`).then(async () => {
    if (focusedSpace !== index) {
      await goToSpace(index)
      run('/usr/local/bin/yabai -m space --destroy').then(() => goToSpace(focusedSpace))
    } else {
      run('/usr/local/bin/yabai -m space --destroy').then(refreshSpaces)
    }
  })
}

export const swapSpace = (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  run(`/usr/local/bin/yabai -m space ${index} --swap ${action}`).then(refreshSpaces)
}
