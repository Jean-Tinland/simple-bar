import OpenedApps from './OpenedApps.jsx'
import SpaceOptions from './SpaceOptions.jsx'
import { classnames, clickEffect } from '../utils.js'

import { goToSpace } from '../yabai'

const EXCLUSIONS = ['Finder', 'iTerm2']

const Space = ({ space, display, windows, SIPDisabled, focusedSpace, displayId }) => {
  if (display.index !== space.display) return null
  const { index, focused, 'native-fullscreen': fullscreen } = space

  const onMouseEnter = (e) => {
    const target = e.target.closest('.space')
    target.classList.add('space--hovered')
  }
  const onMouseLeave = (e) => {
    const target = e.target.closest('.space')
    target.classList.remove('space--hovered')
  }
  const onClick = (e) => {
    goToSpace(index, focusedSpace)
    clickEffect(e)
    const target = e.target.closest('.space')
    target.classList.add('space--clicked')
  }

  const classes = classnames('space', {
    'space--focused': focused === 1,
    'space--fullscreen': fullscreen === 1
  })

  if (focused) focusedSpace = index

  const apps = windows.filter(
    (app) => app.space === index && (app['native-fullscreen'] === 1 || !EXCLUSIONS.includes(app.app))
  )

  return (
    <div className={classes} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="space__inner" onClick={onClick}>
        {index} <OpenedApps apps={apps} />
      </div>
      {SIPDisabled && <SpaceOptions index={index} displayId={displayId} />}
    </div>
  )
}

export default Space
