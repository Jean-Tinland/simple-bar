import * as Uebersicht from 'uebersicht'
import * as Settings from './settings'
import * as Utils from './utils'

const settings = Settings.get()
const { yabaiPath = '/usr/local/bin/yabai' } = settings.global

export const goToSpace = (index) => Uebersicht.run(`${yabaiPath} -m space --focus ${index}`)

export const renameSpace = (index, label) => Uebersicht.run(`${yabaiPath} -m space ${index} --label "${label}"`)

export const createSpace = async (displayId) => {
  await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`)
  await Uebersicht.run(`${yabaiPath} -m space --create`)
  await Utils.refreshSpaces()
}

export const removeSpace = async (index, displayId) => {
  await Uebersicht.run(`${yabaiPath} -m display --focus ${displayId}`)
  await Uebersicht.run(`${yabaiPath} -m space ${index} --destroy`)
  await Utils.refreshSpaces()
}

export const swapSpace = async (index, direction) => {
  const action = direction === 'left' ? index - 1 : index + 1
  await Uebersicht.run(`${yabaiPath} -m space ${index} --swap ${action}`)
  await Utils.refreshSpaces()
}

export const focusWindow = (id) => Uebersicht.run(`${yabaiPath} -m window --focus ${id}`)
