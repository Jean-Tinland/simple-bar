import * as Uebersicht from 'uebersicht'
import OpenedApps from './opened-apps.jsx'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

const Stickies = ({ display, windows }) => {
  const { spacesDisplay } = Settings.get()
  const { exclusionsAsRegex, hideDuplicateAppsInSpaces } = spacesDisplay
  const exclusions = exclusionsAsRegex ? spacesDisplay.exclusions : spacesDisplay.exclusions.split(', ')
  const titleExclusions = exclusionsAsRegex ? spacesDisplay.titleExclusions : spacesDisplay.titleExclusions.split(', ')

  const { stickyWindows: apps } = Utils.stickyWindowWorkaround(
    windows,
    hideDuplicateAppsInSpaces,
    display,
    undefined,
    exclusions,
    titleExclusions,
    exclusionsAsRegex
  )

  if (!apps.filter((app) => app.minimized === 0)?.length) return null

  return (
    <Uebersicht.React.Fragment>
      <div className="stickies">
        <button className="stickies__inner">
          <OpenedApps apps={apps} />
        </button>
      </div>
    </Uebersicht.React.Fragment>
  )
}

export default Stickies
