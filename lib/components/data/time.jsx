import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

export { timeStyles as styles } from '../../styles/components/data/time'

const refreshFrequency = 1000

const displayNotificationCenter = () =>
  Uebersicht.run(
    `osascript -e 'tell application "System Events" to click menu bar item "Clock" of menu bar 1 of application process "ControlCenter"'`
  )

const settings = Settings.get()

export const Widget = () => {
  const { widgets, timeWidgetOptions } = settings
  const { timeWidget } = widgets
  const { hour12, dayProgress, showSeconds } = timeWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(timeWidget)

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: showSeconds ? 'numeric' : undefined,
    hour12
  }

  const getTime = () => {
    const time = new Date().toLocaleString('en-UK', options)
    setState({ time })
    setLoading(false)
  }

  useWidgetRefresh(timeWidget, getTime, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="time" />
  if (!state) return null
  const { time } = state

  const [dayStart, dayEnd] = [new Date(), new Date()]
  dayStart.setHours(0, 0, 0)
  dayEnd.setHours(0, 0, 0)
  dayEnd.setDate(dayEnd.getDate() + 1)
  const range = dayEnd - dayStart
  const diff = Math.max(0, dayEnd - new Date())
  const fillerWidth = (100 - (100 * diff) / range) / 100

  const onClick = (e) => {
    if (displayNotificationCenter) {
      Utils.clickEffect(e)
      displayNotificationCenter()
    }
  }

  return (
    <DataWidget.Widget classes="time" Icon={Icons.Clock} onClick={onClick}>
      {time}
      {dayProgress && <div className="time__filler" style={{ transform: `scaleX(${fillerWidth})` }} />}
    </DataWidget.Widget>
  )
}
