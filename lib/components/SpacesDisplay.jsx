import { run } from 'uebersicht'
import { appIcons } from '../data.js'
import { Add, Remove, Cancel } from './Icons.jsx'

export const refreshFrequency = false

const appExclusions = ['Finder', 'iTerm2']

const goToSpace = (index) => run(`/usr/local/bin/yabai -m space --focus ${index}`)

const createSpace = (index) => () => run('/usr/local/bin/yabai -m space --create').then(() => goToSpace(index + 1))

const removeSpace = (index, focusedSpace) => {
  if (focusedSpace !== index) {
    goToSpace(index)
    run('/usr/local/bin/yabai -m space --destroy').then(() => goToSpace(focusedSpace))
  } else {
    run('/usr/local/bin/yabai -m space --destroy')
  }
}

const buildClassName = (focused, fullscreen) => {
  let classes = ['space']
  if (focused === 1) classes.push('space--focused')
  if (fullscreen === 1) classes.push('space--fullscreen')
  classes = classes.join(' ')
  return classes
}

const OpenedApps = ({ apps }) => {
  if (apps.length === 0) return null
  return apps
    .sort((a, b) => a.app.localeCompare(b.app))
    .map((app, i) => {
      console.log(app)
      const { minimized, focused, app: name } = app
      if (minimized === 1) return null
      const Icon = appIcons[name] || appIcons['Default']
      const classes = focused === 1 ? 'space__icon space__icon--focused' : 'space__icon'
      return <Icon className={classes} key={i} />
    })
}

const handleSpaceClick = (removing, index, focusedSpace) => () => {
  if (removing) {
    removeSpace(index, focusedSpace)
  } else {
    if (index === focusedSpace) return
    goToSpace(index)
  }
}

const SpacesDisplay = ({ output, SIP, displayId, dispatch, removing }) => {
  const { displays, spaces, windows } = output
  let focusedSpace

  const toggleRemoveMode = () => dispatch({ type: removing ? 'STOP-REMOVING' : 'START-REMOVING' })

  if (!output) return <div className="spaces-display spaces-display--empty" />

  const SIPDisabled = SIP === 'System Integrity Protection status: disabled.'

  const classes = removing ? 'spaces-display spaces-display--removing' : 'spaces-display'

  console.log({ displays, spaces, windows })
  return displays.map((display, i) => {
    if (display.index !== displayId) return null
    return (
      <div key={i} className={classes}>
        {SIPDisabled &&
          (!removing ? (
            <div className="space space--remove" onClick={toggleRemoveMode}>
              <Remove className="space__icon" />
            </div>
          ) : (
            <div className="space space--cancel-remove" onClick={toggleRemoveMode}>
              <Cancel className="space__icon" />
            </div>
          ))}
        {spaces.map((space, i) => {
          const { index, focused, 'native-fullscreen': fullscreen } = space

          const classes = buildClassName(focused, fullscreen)

          if (focused) focusedSpace = index

          const apps = windows.filter(
            (app) => app.space === index && (app['native-fullscreen'] === 1 || !appExclusions.includes(app.app))
          )

          return display.index === space.display ? (
            <span key={i} className={classes} onClick={handleSpaceClick(removing, index, focusedSpace)}>
              {index} <OpenedApps apps={apps} />
            </span>
          ) : null
        })}
        {SIPDisabled && !removing && (
          <div className="space space--add" onClick={createSpace(spaces.length)}>
            <Add className="space__icon" />
          </div>
        )}
      </div>
    )
  })
}

export default SpacesDisplay
