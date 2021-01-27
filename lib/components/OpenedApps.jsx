import { appIcons } from '../data.js'
import { classnames } from '../utils.js'

const OpenedApps = ({ type, apps }) => {
  if (apps.length === 0) return null
  return apps
    .sort((a, b) => (type === 'stack' ? a['stack-index'] > b['stack-index'] : a.id > b.id))
    .map((app, i) => {
      const { minimized, focused, app: name, 'zoom-parent': zoomParent, 'zoom-fullscreen': zoomFullscreen } = app
      if (minimized === 1) return null

      const Icon = appIcons[name] || appIcons['Default']
      const classes = classnames('space__icon', {
        'space__icon--focused': focused === 1,
        'space__icon--fullscreen': zoomParent === 1 || zoomFullscreen === 1
      })
      return <Icon className={classes} key={i} />
    })
}

export default OpenedApps
