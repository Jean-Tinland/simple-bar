import { run } from 'uebersicht'

import { refreshSpaces } from './utils.js'

export const goToSpace = (index) => run(`$(which yabai) -m space --focus ${index}`)

export const createSpace = (displayId) => {
  run(`$(which yabai) -m display --focus ${displayId}`).then(() => {
    run('$(which yabai) -m space --create').then(refreshSpaces)
  })
}

export const removeSpace = (index, displayId) => {
  run(`$(which yabai) -m display --focus ${displayId}`).then(async () => {
    run(`$(which yabai) -m space ${index} --destroy`).then(refreshSpaces)
  })
}

export const swapSpace = (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  run(`$(which yabai) -m space ${index} --swap ${action}`).then(refreshSpaces)
}
