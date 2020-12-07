import Settings from './Settings.jsx'
import { classnames, refreshSpaces, refreshProcess, refreshData } from '../utils.js'

const message = {
  error: 'Something went wrong...',
  noOutput: 'Loading...',
  noData: 'JSON error...'
}

const Error = ({ widget, type, withSettings }) => {
  const classes = classnames(`simple-bar simple-bar--${widget} simple-bar--empty`, {
    'simple-bar--loading': type === 'noOutput'
  })

  if (type === 'error') {
    if (widget === 'spaces') refreshSpaces()
    if (widget === 'process') refreshProcess()
    if (widget === 'data') refreshData()
  }

  return (
    <div className={classes}>
      <span>
        simple-bar-{widget}.jsx: {message[type]}
      </span>
      {withSettings && <Settings />}
    </div>
  )
}

export default Error
