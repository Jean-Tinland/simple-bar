import { classnames, clickEffect, getLocation, notification } from '../utils.js'
import { SunIcon, CloudIcon, RainIcon, SnowIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

const getIcon = (description) => {
  if (description.includes('snow')) return SnowIcon
  if (description.includes('rain')) return RainIcon
  if (description.includes('cloud')) return CloudIcon
  return SunIcon
}

const refreshWeather = (e) => {
  clickEffect(e)
  notification('Opening forecast from wttr.in...')
}

const Weather = ({ output }) => {
  const settings = getSettings()
  const { weatherWidget } = settings.widgets
  if (!weatherWidget || !output) return null

  const { data } = output
  if (!data.current_condition) return null

  const { unit, customLocation } = settings.weatherWidgetOptions
  const userLocation = customLocation !== '' ? customLocation : undefined
  const location = userLocation || getLocation()

  const { temp_C, temp_F, weatherDesc } = data.current_condition[0]
  const temperature = unit === 'C' ? temp_C : temp_F

  const description = weatherDesc[0].value

  const { astronomy } = data.weather[0]
  const sunriseData = astronomy[0].sunrise.replace(' AM', '').split(':')
  const sunsetData = astronomy[0].sunset.replace(' PM', '').split(':')

  const nowIntervalStart = new Date()
  nowIntervalStart.setHours(nowIntervalStart.getHours() - 1)
  const nowIntervalStop = new Date()
  nowIntervalStop.setHours(nowIntervalStop.getHours() + 1)
  const sunriseTime = new Date()
  sunriseTime.setHours(parseInt(sunriseData[0]), parseInt(sunriseData[1]), 0, 0)
  const sunsetTime = new Date()
  sunsetTime.setHours(parseInt(sunsetData[0]) + 12, parseInt(sunsetData[1]), 0, 0)

  const Icon = getIcon(description)

  const sunrising = sunriseTime >= nowIntervalStart && sunriseTime <= nowIntervalStop
  const sunsetting = sunsetTime >= nowIntervalStart && sunsetTime <= nowIntervalStop

  const classes = classnames('weather', {
    'weather--sunrise': sunrising,
    'weather--sunset': sunsetting
  })

  return (
    <a className={classes} href={`https://wttr.in/${location}`} onClick={refreshWeather}>
      <div className="weather__gradient" />
      <Icon className="weather__icon" />
      {location}, {temperature}°{unit}
    </a>
  )
}

export default Weather
