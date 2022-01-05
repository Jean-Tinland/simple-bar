import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Utils from '../../utils'
import * as Settings from '../../settings'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { dateStyles as styles } from '../../styles/components/data/date-display'

const settings = Settings.get()
const { widgets, dateWidgetOptions } = settings
const { dateWidget } = widgets
const { refreshFrequency, shortDateFormat, locale, calendarApp } = dateWidgetOptions

const DEFAULT_REFRESH_FREQUENCY = 30000
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY)

const openCalendarApp = (calendarApp) => {
  const appName = calendarApp || 'Calendar'
  Uebersicht.run(`open -a "${appName}"`)
}

export const Widget = () => {
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(dateWidget)

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

  useWidgetRefresh(dateWidget, getDate, REFRESH_FREQUENCY)

  if (loading) return <DataWidgetLoader.Widget className="date-display" />
  if (!state) return null
  const { now } = state

  const onClick = (e) => {
    Utils.clickEffect(e)
    openCalendarApp(calendarApp)
  }

  return (
    <DataWidget.Widget classes="date-display" Icon={Icons.Date} onClick={onClick}>
      {now}
    </DataWidget.Widget>
  )
}
