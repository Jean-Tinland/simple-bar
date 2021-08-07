import Settings from './process/settings.jsx'
import * as Utils from '../utils'

const message = {
  error: 'Something went wrong...',
  noOutput: 'Loading...',
  noData: 'JSON error...'
}

export const Component = ({ type, classes, withSettings }) => {
  const errorClasses = Utils.classnames('simple-bar--empty', classes, {
    'simple-bar--loading': type === 'noOutput'
  })

  if (type === 'error' || type === 'noData') {
    Utils.refreshSpaces()
  }

  return (
    <div className={errorClasses}>
      <span>simple-bar-spaces.jsx: {message[type]}</span>
      {withSettings && <Settings />}
    </div>
  )
}
