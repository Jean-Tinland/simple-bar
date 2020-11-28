import { appIcons } from '../data.js'
import { classnames } from '../utils.js'

const OpenedApps = ({ type, apps }) => {
  if (apps.length === 0) return null
  return apps
    .sort((a, b) => {
      if (type === 'stack') {
        return a['stack-index'] > b['stack-index']
      }
      return a.id > b.id
    })
    .map((app, i) => {
      const { minimized, focused, app: name } = app
      if (minimized === 1) return null
      const Icon = appIcons[name] || appIcons['Default']
      const classes = classnames('space__icon', {
        'space__icon--focused': focused === 1
      })
      return <Icon className={classes} key={i} />
    })
}

export default OpenedApps
