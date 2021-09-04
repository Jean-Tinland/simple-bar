import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

export { batteryStyles as styles } from '../../styles/components/data/battery'

const refreshFrequency = 10000

const getTransform = (value) => {
  let transform = `0.${value}`
  if (value === 100) transform = '1'
  if (value < 10) transform = `0.0${value}`
  return `scaleX(${transform})`
}

const toggleCaffeinate = async (caffeinate, option) => {
  if (!caffeinate.length) {
    Uebersicht.run(`caffeinate ${option} &`)
    Utils.notification('Enabling caffeinate...')
  } else {
    await Uebersicht.run('pkill -f caffeinate')
    Utils.notification('Disabling caffeinate...')
  }
}

const settings = Settings.get()

export const Widget = () => {
  const { widgets, batteryWidgetOptions } = settings
  const { batteryWidget } = widgets
  const { toggleCaffeinateOnClick, caffeinateOption } = batteryWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(batteryWidget)

  const getBattery = async () => {
    const [percentage, status, caffeinate] = await Promise.all([
      Uebersicht.run(`pmset -g batt | egrep '([0-9]+%).*' -o --colour=auto | cut -f1 -d'%'`),
      Uebersicht.run(`pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19`),
      Uebersicht.run(`pgrep caffeinate`)
    ])
    setState({
      percentage: parseInt(percentage),
      charging: Utils.cleanupOutput(status) === 'AC',
      caffeinate: Utils.cleanupOutput(caffeinate)
    })
    setLoading(false)
  }

  useWidgetRefresh(batteryWidget, getBattery, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="battery" />
  if (!state) return null

  const { percentage, charging, caffeinate } = state
  const isLowBattery = !charging && percentage < 20

  const classes = Utils.classnames('battery', {
    'battery--low': isLowBattery,
    'battery--caffeinate': caffeinate.length
  })

  const transformValue = getTransform(percentage)

  const onClick = async (e) => {
    Utils.clickEffect(e)
    await toggleCaffeinate(caffeinate, caffeinateOption)
    getBattery()
  }

  const onClickProp = toggleCaffeinateOnClick ? { onClick } : {}

  const Icon = () => (
    <div className="battery__icon">
      <div className="battery__icon-inner">
        {charging && <Icons.Charging className="battery__charging-icon" />}
        <div className="battery__icon-filler" style={{ transform: transformValue }} />
      </div>
    </div>
  )

  return (
    <DataWidget.Widget classes={classes} Icon={Icon} {...onClickProp}>
      {caffeinate !== '' && <Icons.Coffee className="battery__caffeinate-icon" />}
      {percentage}%
    </DataWidget.Widget>
  )
}
