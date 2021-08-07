import Window from './window.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'

export { processStyles as styles } from '../../styles/components/process'

const settings = Settings.get()

export const Component = ({ displayIndex, spaces, visibleSpaces, windows }) => {
  if (!windows) return null
  const { process, spacesDisplay } = settings
  const { exclusionsAsRegex } = spacesDisplay
  const exclusions = exclusionsAsRegex ? spacesDisplay.exclusions : spacesDisplay.exclusions.split(', ')
  const titleExclusions = exclusionsAsRegex ? spacesDisplay.titleExclusions : spacesDisplay.titleExclusions.split(', ')

  return (
    <div className="process">
      <div className="process__container">
        {process.showCurrentSpaceMode &&
          spaces
            .filter(({ display, index }) => visibleSpaces.includes(index) && display === displayIndex)
            .map(({ index, type }) => (
              <div key={index} className="process__layout">
                {type}
              </div>
            ))}
        {windows
          .filter((app) => Utils.filterApps(app, exclusions, titleExclusions, exclusionsAsRegex))
          .filter(({ display, space }) => visibleSpaces.includes(space) && display === displayIndex)
          .sort((a, b) => a.id > b.id)
          .map((window, i) => (
            <Window key={i} displayIndex={displayIndex} window={window} />
          ))}
      </div>
    </div>
  )
}
