import { ClockIcon } from './Icons.jsx'

const Time = () => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }
  const time = new Date().toLocaleString('en-UK', options)
  return (
    <div className="time">
      <ClockIcon className="time__icon" />
      {time}
    </div>
  )
}

export default Time
