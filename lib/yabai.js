import { run } from 'uebersicht'

import { refreshSpaces } from './utils.js'

export const goToSpace = (index) => run(`/usr/local/bin/yabai -m space --focus ${index}`)

export const createSpace = (displayId) => {
  run(`/usr/local/bin/yabai -m display --focus ${displayId}`).then(() => {
    run('/usr/local/bin/yabai -m space --create').then(refreshSpaces)
  })
}

export const removeSpace = (index, displayId) => {
  run(`/usr/local/bin/yabai -m display --focus ${displayId}`).then(async () => {
    run(`/usr/local/bin/yabai -m space ${index} --destroy`).then(refreshSpaces)
  })
}

export const swapSpace = (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  run(`/usr/local/bin/yabai -m space ${index} --swap ${action}`).then(refreshSpaces)
}
