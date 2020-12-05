import { run } from 'uebersicht'

import { getSettings } from './settings.js'
import { refreshSpaces } from './utils.js'

const settings = getSettings()
const { yabaiPath } = settings.global

export const goToSpace = (index) => run(`${yabaiPath} -m space --focus ${index}`)

export const createSpace = (displayId) => {
  run(`${yabaiPath} -m display --focus ${displayId}`).then(() => {
    run('${yabaiPath} -m space --create').then(refreshSpaces)
  })
}

export const removeSpace = (index, displayId) => {
  run(`${yabaiPath} -m display --focus ${displayId}`).then(async () => {
    run(`${yabaiPath} -m space ${index} --destroy`).then(refreshSpaces)
  })
}

export const swapSpace = (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  run(`${yabaiPath} -m space ${index} --swap ${action}`).then(refreshSpaces)
}
