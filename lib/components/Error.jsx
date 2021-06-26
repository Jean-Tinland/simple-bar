import Settings from './process/settings.jsx'
import { classnames, hardRefresh } from '../utils'

const message = {
  error: 'Something went wrong...',
  noOutput: 'Loading...',
  noData: 'JSON error...'
}

const Error = ({ type, classes, withSettings }) => {
  const errorClasses = classnames('simple-bar--empty', classes, {
    'simple-bar--loading': type === 'noOutput'
  })

  const onClick = type === 'error' ? hardRefresh : undefined
  const reloadText = type === 'error' ? ', click to reload' : ''

  return (
    <div className={errorClasses}>
      <span onClick={onClick}>
        simple-bar-spaces.jsx: {message[type]}
        {reloadText}
      </span>
      {withSettings && <Settings />}
    </div>
  )
}

export default Error
