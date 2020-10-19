import { React } from 'uebersicht'

import OpenedApps from './OpenedApps.jsx'
import SpaceOptions from './SpaceOptions.jsx'
import { classnames, clickEffect } from '../utils.js'

import { goToSpace } from '../yabai.js'
import { getSettings } from '../settings.js'

const { useState } = React

const Space = ({ space, display, windows, clickedSpace, setClickedSpace, displayId, SIPDisabled }) => {
  const [hovered, setHovered] = useState(false)
  const [noDelay, setNoDelay] = useState(false)
  if (display !== space.display) return null
  const { index, label, focused, 'native-fullscreen': fullscreen } = space
  const settings = getSettings()
  const { spacesDisplay } = settings
  const exclusions = spacesDisplay.exclusions.split(', ')

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
    setClickedSpace(index)
  }

  const classes = classnames('space', {
    'space--focused': focused === 1,
    'space--fullscreen': fullscreen === 1,
    'space--hovered': hovered,
    'space--no-delay': noDelay,
    'space--clicked': clickedSpace === index
  })

  const apps = windows.filter(
    (app) => app.space === index && (app['native-fullscreen'] === 1 || !exclusions.includes(app.app))
  )

  const spaceLabel = label && label !== '' ? label : index

  return (
    <div className={classes} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="space__inner" onClick={onClick}>
        {spaceLabel} <OpenedApps apps={apps} />
      </div>
      {SIPDisabled && <SpaceOptions index={index} setHovered={setHovered} displayId={displayId} />}
    </div>
  )
}

export default Space
