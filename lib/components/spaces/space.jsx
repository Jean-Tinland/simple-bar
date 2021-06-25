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
  const { displayAllSpacesOnAllScreens, exclusionsAsRegex } = spacesDisplay
  if (!displayAllSpacesOnAllScreens && display !== space.display) return null

  const { index, label, focused, visible, 'native-fullscreen': fullscreen, type } = space
  const exclusions = exclusionsAsRegex ? spacesDisplay.exclusions : spacesDisplay.exclusions.split(', ')
  const titleExclusions = exclusionsAsRegex ? spacesDisplay.titleExclusions : spacesDisplay.titleExclusions.split(', ')

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

  const apps = windows.filter(
    (app) => app.space === index && filterApps(app, exclusions, titleExclusions, exclusionsAsRegex)
  )

  if (!focused && !visible && apps.length === 0 && spacesDisplay.hideEmptySpaces) return null

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
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && <div className="spaces__separator" />}
      <div className={classes} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <button className="space__inner" onClick={onClick}>
          <span className="space__label">{spaceLabel}</span> <OpenedApps type={type} apps={apps} />
        </button>
        {!spacesDisplay.hideSpacesOptions && SIPDisabled && (
          <SpaceOptions index={index} setHovered={setHovered} displayIndex={displayIndex} />
        )}
      </div>
    </>
  )
}

export default Space
