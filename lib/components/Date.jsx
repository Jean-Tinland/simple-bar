import { DateIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

const DateDisplay = () => {
  const settings = getSettings()
  const { dateWidget } = settings.widgets
  if (!dateWidget) return null

  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }
  const now = new Date().toLocaleDateString('en-UK', options)
  return (
    <div className="date">
      <DateIcon className="date__icon" />
      {now}
    </div>
  )
}

export default DateDisplay
