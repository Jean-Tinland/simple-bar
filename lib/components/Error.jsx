import Settings from './process/settings.jsx'
import { classnames, refreshSpaces, refreshProcess, refreshData } from '../utils'

const message = {
  error: 'Something went wrong...',
  noOutput: 'Loading...',
  noData: 'JSON error...'
}

const Error = ({ widget, type, classes, withSettings }) => {
  const errorClasses = classnames('simple-bar--empty', classes, {
    'simple-bar--loading': type === 'noOutput'
  })

  if (type === 'error') {
    if (widget === 'spaces') refreshSpaces()
    if (widget === 'process') refreshProcess()
    if (widget === 'data') refreshData()
  }

  return (
    <div className={errorClasses}>
      <span>
        simple-bar-{widget}.jsx: {message[type]}
      </span>
      {withSettings && <Settings />}
    </div>
  )
}

export default Error
