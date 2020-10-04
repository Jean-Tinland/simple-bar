import { DateIcon } from './Icons.jsx'

const DateDisplay = () => {
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
