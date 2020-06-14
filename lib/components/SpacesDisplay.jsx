import { appIcons } from '../data.js'

export const refreshFrequency = false

const appExclusions = ['Finder', 'iTerm2']

const OpenedApps = ({ apps }) => {
  if (apps.length === 0) return null
  return apps.map((el) => {
    const Icon = appIcons[el.app] || appIcons['Default']
    return <Icon />
  })
}

const SpacesDisplay = ({ output, displayId }) => {
  const { displays, spaces, windows } = output

  if (!output) return <div className="spaces-display spaces-display--empty" />

  return displays.map((display, i) => {
    console.log(display)
    if (display.index !== displayId) return null
    return (
      <div key={i} className="spaces-display">
        {spaces.map((space, i) => {
          const { index, focused } = space

          const classes = focused ? 'space space--focused' : 'space'

          const apps = windows.filter((app) => app.space === index && !appExclusions.includes(app.app))

          return display.index === space.display ? (
            <span key={i} className={classes}>
              {index} <OpenedApps apps={apps} />
            </span>
          ) : null
        })}
      </div>
    )
  })
}

export default SpacesDisplay
