import { React, run } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { DateIcon } from '../icons.jsx'
import { clickEffect } from '../../utils'
import { getSettings } from '../../settings'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'

export { dateStyles } from '../../styles/components/data/date-display'

const { useState } = React

const refreshFrequency = 1000

const openCalendarApp = (calendarApp) => {
  const appName = calendarApp ? calendarApp : 'Calendar'
  run(`open -a "${appName}"`)
}

const DateDisplay = () => {
  const settings = getSettings()
  const { widgets, dateWidgetOptions } = settings
  const { dateWidget } = widgets
  const { shortDateFormat, locale, calendarApp } = dateWidgetOptions

  const [state, setState] = useState()
  const [loading, setLoading] = useState(dateWidget)

  const formatOptions = shortDateFormat ? 'short' : 'long'

  const options = {
    weekday: formatOptions,
    month: formatOptions,
    day: 'numeric'
  }
  const _locale = locale.length > 4 ? locale : 'en-UK'

  const getDate = () => {
    const now = new Date().toLocaleDateString(_locale, options)
    setState({ now })
    setLoading(false)
  }

  useWidgetRefresh(dateWidget, getDate, refreshFrequency)

  if (loading) return <DataWidgetLoader className="date-display" />
  if (!state) return null
  const { now } = state

  const onClick = (e) => {
    clickEffect(e)
    openCalendarApp(calendarApp)
  }

  return (
    <DataWidget classes="date-display" Icon={DateIcon} onClick={onClick}>
      {now}
    </DataWidget>
  )
}

export default DateDisplay
