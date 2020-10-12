import { DateIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

const DateDisplay = () => {
  const settings = getSettings()
  const { widgets, dateWidgetOptions } = settings
  const { dateWidget } = widgets
  if (!dateWidget) return null

  const { shortDateFormat, locale } = dateWidgetOptions
  const formatOptions = shortDateFormat ? 'short' : 'long'

  const options = {
    weekday: formatOptions,
    month: formatOptions,
    day: 'numeric'
  }

  const _locale = locale.length >= 5 ? locale : 'en-UK'
  const now = new Date().toLocaleDateString(_locale, options)
  return (
    <div className="date">
      <DateIcon className="date__icon" />
      {now}
    </div>
  )
}

export default DateDisplay
