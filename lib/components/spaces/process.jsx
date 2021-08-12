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
  const currentSpace = spaces.find(({ visible, display }) => visible && display === displayIndex)
  const { stickyWindows, nonStickyWindows } = Utils.stickyWindowWorkaround(
    windows,
    false,
    displayIndex,
    currentSpace.index,
    exclusions,
    titleExclusions,
    exclusionsAsRegex
  )

  const apps = [...stickyWindows, ...nonStickyWindows]

  return (
    <div className="process">
      <div className="process__container">
        {process.showCurrentSpaceMode && (
          <div key={currentSpace.index} className="process__layout">
            {currentSpace.type}
          </div>
        )}
        {Utils.sortWindows(apps).map((window, i) => (
          <Window key={i} window={window}/>
        ))}
      </div>
    </div>
  )
}
