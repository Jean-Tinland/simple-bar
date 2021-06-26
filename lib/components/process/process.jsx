import Window from './window.jsx'

const Process = ({ displayIndex, visibleSpaces, windows }) => {
  if (!windows) return null
  return (
    <div className="process">
      <div className="process__container">
        {windows
          .filter((window) => visibleSpaces.includes(window.space) && window.display === displayIndex)
          .sort((a, b) => a.id > b.id)
          .map((window, i) => (
            <Window key={i} displayIndex={displayIndex} window={window} />
          ))}
      </div>
    </div>
  )
}

export default Process
