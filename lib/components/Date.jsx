import { Date as DateIcon } from './Icons.jsx'

const DateDisplay = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  const now = new Date().toLocaleDateString('en-UK', options)
  return (
    <div className="date">
      <DateIcon className="date__icon" />
      {now}
    </div>
  )
}

export default DateDisplay
