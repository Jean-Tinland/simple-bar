import { ClockIcon } from './Icons.jsx'

const Time = () => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }
  const time = new Date().toLocaleString('en-UK', options)

  const [dayStart, dayEnd] = [new Date(), new Date()]
  dayStart.setHours(0, 0, 0)
  dayEnd.setHours(0, 0, 0)
  dayEnd.setDate(dayEnd.getDate() + 1)
  const range = dayEnd - dayStart
  const diff = Math.max(0, dayEnd - new Date())
  const fillerWidth = (100 - (100 * diff) / range) / 100

  return (
    <div className="time">
      <ClockIcon className="time__icon" />
      {time}
      <div className="time__filler" style={{ transform: `scaleX(${fillerWidth})` }} />
    </div>
  )
}

export default Time
