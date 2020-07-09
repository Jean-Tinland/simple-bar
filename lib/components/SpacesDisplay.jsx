import { run } from 'uebersicht'
import { appIcons } from '../data.js'
import { Add } from './Icons.jsx'

export const refreshFrequency = false

const appExclusions = ['Finder', 'iTerm2']

const goToSpace = (index) => () => run(`/usr/local/bin/yabai -m space --focus ${index}`)

const createSpace = (index) => () => {
  console.log(index)
  run('/usr/local/bin/yabai -m space --create')
  goToSpace(index + 1)()
}

const OpenedApps = ({ apps }) => {
  if (apps.length === 0) return null
  return apps.map((app) => {
    const { minimized, app: name } = app
    if (minimized === 1) return null
    const Icon = appIcons[name] || appIcons['Default']
    return <Icon />
  })
}

const SpacesDisplay = ({ output, SIP, displayId }) => {
  const { displays, spaces, windows } = output

  if (!output) return <div className="spaces-display spaces-display--empty" />
  const SIPDisabled = SIP === 'System Integrity Protection status: disabled.'
  return displays.map((display, i) => {
    if (display.index !== displayId) return null
    return (
      <div key={i} className="spaces-display">
        {spaces.map((space, i) => {
          const { index, focused } = space

          const classes = focused ? 'space space--focused' : 'space'

          const apps = windows.filter((app) => app.space === index && !appExclusions.includes(app.app))

          return display.index === space.display ? (
            <span key={i} className={classes} onClick={goToSpace(index)}>
              {index} <OpenedApps apps={apps} />
            </span>
          ) : null
        })}
        {SIPDisabled && (
          <div className="space space--add" onClick={createSpace(spaces.length)}>
            <Add />
          </div>
        )}
      </div>
    )
  })
}

export default SpacesDisplay
