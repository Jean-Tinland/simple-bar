import { React } from 'uebersicht'

import OpenedApps from './opened-apps.jsx'
import SpaceOptions from './space-options.jsx'
import { classnames, clickEffect, filterApps } from '../../utils'

import { goToSpace } from '../../yabai'
import { getSettings } from '../../settings'

const { useState } = React

const Space = ({ space, display, windows, displayIndex, SIPDisabled, lastOfSpace }) => {
  const [hovered, setHovered] = useState(false)
  const [noDelay, setNoDelay] = useState(false)

  const settings = getSettings()
  const { spacesDisplay } = settings
  if (!spacesDisplay.displayAllSpacesOnAllScreens && display !== space.display) return null

  const { index, label, focused, visible, 'native-fullscreen': fullscreen, type } = space
  const exclusions = spacesDisplay.exclusions.split(', ')
  const titleExclusions = spacesDisplay.titleExclusions.split(', ')

  const onMouseEnter = (e) => {
    setHovered(true)
    if (e.metaKey) setNoDelay(true)
  }
  const onMouseLeave = () => {
    setHovered(false)
    setNoDelay(false)
  }
  const onClick = (e) => {
    if (focused === 1) return
    goToSpace(index)
    clickEffect(e)
  }

  const apps = windows.filter((app) => app.space === index && filterApps(app, exclusions, titleExclusions))

  const classes = classnames(`space space--${type}`, {
    'space--focused': focused === 1,
    'space--visible': visible === 1,
    'space--fullscreen': fullscreen === 1,
    'space--hovered': hovered,
    'space--no-delay': noDelay,
    'space--empty': apps.length === 0
  })

  const spaceLabel = label && label !== '' ? label : index

  return (
    <>
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && <div class="space-separator" />}
      <div className={classes} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className="space__inner" onClick={onClick}>
          <span className="space__label">{spaceLabel}</span> <OpenedApps type={type} apps={apps} />
        </div>
        {SIPDisabled && <SpaceOptions index={index} setHovered={setHovered} displayIndex={displayIndex} />}
      </div>
    </>
  )
}

export default Space
