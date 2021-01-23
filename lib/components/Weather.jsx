import { classnames, clickEffect, getLocation, notification, setLocation } from '../utils.js'
import { SunIcon, MoonIcon, CloudIcon, RainIcon, SnowIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

const getIcon = (description, atNight) => {
  if (description.includes('snow')) return SnowIcon
  if (description.includes('rain')) return RainIcon
  if (description.includes('cloud')) return CloudIcon
  if (atNight) return MoonIcon
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

  const { unit, hideLocation, hideGradient, customLocation } = settings.weatherWidgetOptions
  const userLocation = customLocation !== '' ? customLocation : undefined
  const location = userLocation || getLocation()
  if (!location) window.geolocation.getCurrentPosition(setLocation)

  const { temp_C, temp_F, weatherDesc } = data.current_condition[0]
  const temperature = unit === 'C' ? temp_C : temp_F

  const description = weatherDesc[0].value

  const { astronomy } = data.weather[0]
  const sunriseData = astronomy[0].sunrise.replace(' AM', '').split(':')
  const sunsetData = astronomy[0].sunset.replace(' PM', '').split(':')

  const now = new Date()
  const nowIntervalStart = new Date()
  nowIntervalStart.setHours(nowIntervalStart.getHours() - 1)
  const nowIntervalStop = new Date()
  nowIntervalStop.setHours(nowIntervalStop.getHours() + 1)
  const sunriseTime = new Date()
  sunriseTime.setHours(parseInt(sunriseData[0]), parseInt(sunriseData[1]), 0, 0)
  const sunsetTime = new Date()
  sunsetTime.setHours(parseInt(sunsetData[0]) + 12, parseInt(sunsetData[1]), 0, 0)

  const atNight = sunriseTime >= now || now >= sunsetTime

  const Icon = getIcon(description, atNight)
  const label = hideLocation ? '' : `${location}, `

  const sunrising = sunriseTime >= nowIntervalStart && sunriseTime <= nowIntervalStop
  const sunsetting = sunsetTime >= nowIntervalStart && sunsetTime <= nowIntervalStop

  const classes = classnames('weather', {
    'weather--sunrise': sunrising,
    'weather--sunset': sunsetting
  })

  return (
    <a className={classes} href={`https://wttr.in/${location}`} onClick={refreshWeather}>
      {!hideGradient && <div className="weather__gradient" />}
      <Icon className="weather__icon" />
      {label}
      {temperature}°{unit}
    </a>
  )
}

export default Weather
