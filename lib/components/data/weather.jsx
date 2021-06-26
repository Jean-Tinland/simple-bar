import { React } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { SunIcon, MoonIcon, CloudIcon, RainIcon, SnowIcon } from '../icons.jsx'
import { classnames, clickEffect, notification } from '../../utils'
import { getSettings } from '../../settings'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'

export { weatherStyles } from '../../styles/components/data/weather'

const { useState } = React

const refreshFrequency = 1000 * 60 * 10

const getIcon = (description, atNight) => {
  if (description.includes('snow')) return SnowIcon
  if (description.includes('rain')) return RainIcon
  if (description.includes('cloud')) return CloudIcon
  if (atNight) return MoonIcon
  return SunIcon
}

const getLabel = (location, temperature, unit, hideLocation) => {
  if (!location) return 'Fetching...'
  if (hideLocation) return `${temperature}°${unit}`
  return `${location}, ${temperature}°${unit}`
}

const refreshWeather = (e) => {
  clickEffect(e)
  notification('Opening forecast from wttr.in...')
}

const getPosition = async (options) =>
  new Promise((resolve, reject) => window.geolocation.getCurrentPosition(resolve, reject, options))

const Weather = () => {
  const [state, setState] = useState()
  const settings = getSettings()
  const { weatherWidget } = settings.widgets
  const [loading, setLoading] = useState(weatherWidget)
  const { customLocation } = settings.weatherWidgetOptions
  const userLocation = weatherWidget && customLocation.length ? customLocation : undefined

  const getWeather = async () => {
    let location = userLocation
    if (!userLocation) {
      const position = await getPosition()
      location = position?.address?.city
    }
    if (!location) {
      setLoading(false)
      return
    }
    const result = await fetch(`https://wttr.in/${location}?format=j1`)
    const data = await result.json()
    setState({ location, data })
    setLoading(false)
  }

  useWidgetRefresh(weatherWidget, getWeather, refreshFrequency)

  if (loading) return <DataWidgetLoader className="weather" />
  if (!state || !state.data.current_condition) return null

  const { unit, hideLocation, hideGradient } = settings.weatherWidgetOptions
  const { temp_C, temp_F, weatherDesc } = state.data.current_condition[0]
  const temperature = unit === 'C' ? temp_C : temp_F
  const wttrUnitParam = unit === 'C' ? '?m' : '?u'

  const description = weatherDesc[0].value

  const { astronomy } = state.data.weather[0]
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
  const label = getLabel(location, temperature, unit, hideLocation)

  const sunrising = sunriseTime >= nowIntervalStart && sunriseTime <= nowIntervalStop
  const sunsetting = sunsetTime >= nowIntervalStart && sunsetTime <= nowIntervalStop

  const classes = classnames('weather', {
    'weather--sunrise': sunrising,
    'weather--sunset': sunsetting
  })

  return (
    <DataWidget
      classes={classes}
      Icon={Icon}
      href={`https://wttr.in/${state.location}${wttrUnitParam}`}
      onClick={refreshWeather}
    >
      {!hideGradient && <div className="weather__gradient" />}
      {label}
    </DataWidget>
  )
}

export default Weather
