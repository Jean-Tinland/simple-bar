import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Utils from '../../utils'
import * as Settings from '../../settings'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { weatherStyles as styles } from '../../styles/components/data/weather'

const refreshFrequency = 1000 * 60 * 10

const getIcon = (description, atNight) => {
  if (description.includes('snow')) return Icons.Snow
  if (description.includes('rain')) return Icons.Rain
  if (description.includes('cloud')) return Icons.Cloud
  if (atNight) return Icons.Moon
  return Icons.Sun
}

const getLabel = (location, temperature, unit, hideLocation) => {
  if (!location) return 'Fetching...'
  if (hideLocation) return `${temperature}°${unit}`
  return `${location}, ${temperature}°${unit}`
}

const openWeather = (e) => {
  Utils.clickEffect(e)
  Utils.notification('Opening forecast from wttr.in...')
}

const getPosition = async () =>
  new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 }))

const settings = Settings.get()

export const Widget = () => {
  const [state, setState] = Uebersicht.React.useState()
  const { weatherWidget } = settings.widgets
  const [loading, setLoading] = Uebersicht.React.useState(weatherWidget)
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

  if (loading) return <DataWidgetLoader.Widget className="weather" />
  if (!state || !state.data.current_condition) return null

  const { unit, hideLocation, hideGradient } = settings.weatherWidgetOptions
  const { temp_C: tempC, temp_F: tempF, weatherDesc } = state.data.current_condition[0]
  const temperature = unit === 'C' ? tempC : tempF
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
  const label = getLabel(state.location, temperature, unit, hideLocation)

  const sunrising = sunriseTime >= nowIntervalStart && sunriseTime <= nowIntervalStop
  const sunsetting = sunsetTime >= nowIntervalStart && sunsetTime <= nowIntervalStop

  const onRightClick = (e) => {
    Utils.clickEffect(e)
    setLoading(true)
    getWeather()
    Utils.notification('Refreshing forecast from wttr.in...')
  }

  const classes = Utils.classnames('weather', {
    'weather--sunrise': sunrising,
    'weather--sunset': sunsetting
  })

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      href={`https://wttr.in/${state.location}${wttrUnitParam}`}
      onClick={openWeather}
      onRightClick={onRightClick}
    >
      {!hideGradient && <div className="weather__gradient" />}
      {label}
    </DataWidget.Widget>
  )
}
