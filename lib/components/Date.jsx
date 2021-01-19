import { run } from 'uebersicht'

import { DateIcon } from './Icons.jsx'
import { clickEffect } from '../utils.js'

import { getSettings } from '../settings.js'

const openCalendarApp = (calendarApp) => {
  const appName = calendarApp ? calendarApp : 'Calendar'
  run(`open -a "${appName}"`)
}

const DateDisplay = () => {
  const settings = getSettings()
  const { widgets, dateWidgetOptions } = settings
  const { dateWidget } = widgets
  if (!dateWidget) return null

  const { shortDateFormat, locale, calendarApp } = dateWidgetOptions
  const formatOptions = shortDateFormat ? 'short' : 'long'

  const options = {
    weekday: formatOptions,
    month: formatOptions,
    day: 'numeric'
  }

  const onClick = (e) => {
    clickEffect(e)
    openCalendarApp(calendarApp)
  }

  const _locale = locale.length >= 5 ? locale : 'en-UK'
  const now = new Date().toLocaleDateString(_locale, options)
  return (
    <div className="date" onClick={onClick}>
      <DateIcon className="date__icon" />
      {now}
    </div>
  )
}

export default DateDisplay
