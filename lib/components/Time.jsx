import { run } from 'uebersicht'

import { ClockIcon } from './Icons.jsx'
import { clickEffect } from '../utils.js'

import { getSettings } from '../settings.js'

const displayNotificationCenter = () => {
  run(`osascript -e 'tell application "System Events" to click menu bar item "Clock" of menu bar 1 of application process "ControlCenter"'`)
}

const Time = () => {
  const settings = getSettings()
  const { widgets, timeWidgetOptions } = settings
  const { timeWidget } = widgets
  if (!timeWidget) return null

  const { hour12, dayProgress } = timeWidgetOptions
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12
  }
  const time = new Date().toLocaleString('en-UK', options)

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
    <div className="time" onClick={onClick}>
      <ClockIcon className="time__icon" />
      {time}
      {dayProgress && <div className="time__filler" style={{ transform: `scaleX(${fillerWidth})` }} />}
    </div>
  )
}

export default Time
