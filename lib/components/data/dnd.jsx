import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

export { dndStyles as styles } from '../../styles/components/data/dnd'

const settings = Settings.get()
const { widgets, dndWidgetOptions } = settings
const { dndWidget } = widgets
const { refreshFrequency, showDndLabel } = dndWidgetOptions

const DEFAULT_REFRESH_FREQUENCY = 60000
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY)

const toggleDnd = async (status) => {
  const newStatus = status === 'on' ? 'off' : 'on'
  await Uebersicht.run(`bash ./simple-bar/lib/scripts/dnd.sh ${newStatus}`)
}

export const Widget = () => {
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(dndWidget)

  const getDnd = async () => {
    const result = await Uebersicht.run(`bash ./simple-bar/lib/scripts/dnd.sh status`)
    const status = Utils.cleanupOutput(result) === 'true' ? 'on' : 'off'
    setState({ status })
    setLoading(false)
  }

  useWidgetRefresh(dndWidget, getDnd, REFRESH_FREQUENCY)

  if (loading) return <DataWidgetLoader.Widget className="time" />
  if (!state) return null
  const { status } = state

  const onClick = async (e) => {
    Utils.clickEffect(e)
    await toggleDnd(status)
    await getDnd()
  }

  const Icon = status === 'on' ? Icons.BellOff : Icons.Bell

  const classes = Utils.classnames('dnd', { 'dnd--no-label': !showDndLabel })

  return (
    <DataWidget.Widget classes={classes} Icon={Icon} onClick={onClick}>
      {showDndLabel && status}
    </DataWidget.Widget>
  )
}
