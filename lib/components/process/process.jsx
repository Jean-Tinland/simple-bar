import Window from './window.jsx'

const Process = ({ displayIndex, visibleSpaces, windows: apps }) => {
  if (!apps) return null
  return (
    <div className="process">
      <div className="process__container">
        {apps
          .filter((app, i) => {
            return visibleSpaces.includes(app.space)
          })
          .sort((a, b) => a.id > b.id)
          .map((app, i) => (
            <Window key={i} app={app} />
          ))}
      </div>
    </div>
  )
}

export default Process
