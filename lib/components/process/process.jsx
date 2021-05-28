import Window from './window.jsx'
import { getSettings } from '../../settings'

const Process = ({ output: apps }) => {
  if (!apps) return null
  const settings = getSettings()
  const { displayOnlyCurrent } = settings.process
  if (displayOnlyCurrent) {
    const [currentApp] = apps.filter((app) => app.focused === 1)
    if (!currentApp) return null
    const { app, title } = currentApp
    return (
      <div className="process">
        {app == title || title == '' ? app : `${app} / ${title}`}
      </div>
    )
  }
  return (
    <div className="process process--all-windows">
      {apps
        .sort((a, b) => a.id > b.id)
        .map((app, i) => (
          <Window key={i} app={app} />
        ))}
    </div>
  )
}

export default Process
