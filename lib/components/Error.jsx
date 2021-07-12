import Settings from './process/settings.jsx'
import { classnames, refreshSpaces } from '../utils'

const message = {
  error: 'Something went wrong...',
  noOutput: 'Loading...',
  noData: 'JSON error...'
}

const Error = ({ type, classes, withSettings }) => {
  const errorClasses = classnames('simple-bar--empty', classes, {
    'simple-bar--loading': type === 'noOutput'
  })

  if (type === 'error' || type === 'noData') {
    refreshSpaces()
  }

  return (
    <div className={errorClasses}>
      <span>simple-bar-spaces.jsx: {message[type]}</span>
      {withSettings && <Settings />}
    </div>
  )
}

export default Error
