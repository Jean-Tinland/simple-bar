import { run } from 'uebersicht'
import { getSettings } from './settings'
import { refreshSpaces } from './utils'

const settings = getSettings()
const { yabaiPath = '/usr/local/bin/yabai' } = settings.global

export const goToSpace = (index) => run(`${yabaiPath} -m space --focus ${index}`)

export const createSpace = async (displayId) => {
  await run(`${yabaiPath} -m display --focus ${displayId}`)
  await run(`${yabaiPath} -m space --create`)
  await refreshSpaces()
}

export const removeSpace = async (index, displayId) => {
  await run(`${yabaiPath} -m display --focus ${displayId}`)
  await run(`${yabaiPath} -m space ${index} --destroy`)
  await refreshSpaces()
}

export const swapSpace = async (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  await run(`${yabaiPath} -m space ${index} --swap ${action}`)
  await refreshSpaces()
}

export const focusWindow = (id) => run(`${yabaiPath} -m window --focus ${id}`)
