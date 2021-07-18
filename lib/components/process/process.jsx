import Window from './window.jsx'
import { getSettings } from '../../settings'

const settings = getSettings()

const Process = ({ displayIndex, spaces, visibleSpaces, windows }) => {
  if (!windows) return null
  const { showCurrentSpaceMode } = settings.process
  return (
    <div className="process">
      <div className="process__container">
        {showCurrentSpaceMode &&
          spaces
            .filter(({ display, index }) => visibleSpaces.includes(index) && display === displayIndex)
            .map(({ index, type }) => (
              <div key={index} className="process__layout">
                {type}
              </div>
            ))}
        {windows
          .filter(({ display, space }) => visibleSpaces.includes(space) && display === displayIndex)
          .sort((a, b) => a.id > b.id)
          .map((window, i) => (
            <Window key={i} displayIndex={displayIndex} window={window} />
          ))}
      </div>
    </div>
  )
}

export default Process
