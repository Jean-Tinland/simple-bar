import { run, React } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import { ClockIcon } from '../icons.jsx'
import { clickEffect } from '../../utils'

import { getSettings } from '../../settings'

export { timeStyles } from '../../styles/components/data/time'

const { useEffect, useState } = React

const displayNotificationCenter = () =>
  run(
    `osascript -e 'tell application "System Events" to click menu bar item "Clock" of menu bar 1 of application process "ControlCenter"'`
  )

const Time = () => {
  const settings = getSettings()
  const { widgets, timeWidgetOptions } = settings
  const { timeWidget } = widgets

  const { hour12, dayProgress, showSeconds } = timeWidgetOptions
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: showSeconds ? 'numeric' : undefined,
    hour12
  }

  const getTime = () => new Date().toLocaleString('en-UK', options)
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    if (timeWidget) {
      const interval = setInterval(() => setTime(getTime()), 1000)
      return () => clearInterval(interval)
    }
  })

  if (!timeWidget) return null

  const [dayStart, dayEnd] = [new Date(), new Date()]
  dayStart.setHours(0, 0, 0)
  dayEnd.setHours(0, 0, 0)
  dayEnd.setDate(dayEnd.getDate() + 1)
  const range = dayEnd - dayStart
  const diff = Math.max(0, dayEnd - new Date())
  const fillerWidth = (100 - (100 * diff) / range) / 100

  const onClick = (e) => {
    if (displayNotificationCenter) {
      clickEffect(e)
      displayNotificationCenter()
    }
  }

  return (
    <DataWidget classes="time" Icon={ClockIcon} onClick={onClick}>
      {time}
      {dayProgress && <div className="time__filler" style={{ transform: `scaleX(${fillerWidth})` }} />}
    </DataWidget>
  )
}

export default Time
