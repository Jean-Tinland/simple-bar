import * as Settings from './settings/settings.jsx'
import * as Utils from '../utils'

const message = {
  error: 'Something went wrong...',
  yabaiError: 'yabai is not running',
  noOutput: 'Loading...',
  noData: 'JSON error...'
}

export const Component = ({ type, classes }) => {
  const errorClasses = Utils.classnames('simple-bar--empty', classes, { 'simple-bar--loading': type === 'noOutput' })

  if (type === 'error' || type === 'noData') {
    Utils.refreshSpaces()
  }

  if (type === 'yabaiError') {
    setTimeout(Utils.refreshSpaces, 15000)
  }

  return (
    <div className={errorClasses}>
      <span>simple-bar-spaces.jsx: {message[type]}</span>
      <Settings.Wrapper />
    </div>
  )
}
