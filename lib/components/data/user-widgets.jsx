import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

const settings = Settings.get()
const { userWidgetsList } = settings.userWidgets

const UserWidget = ({ widget }) => {
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(true)
  const {
    icon,
    backgroundColor,
    output,
    onClickAction,
    onRightClickAction,
    onMiddleClickAction,
    refreshFrequency
  } = widget

  const getUserWidget = async () => {
    const widgetOutput = await Uebersicht.run(output)
    if (!Utils.cleanupOutput(widgetOutput).length) {
      setLoading(false)
      return
    }
    setState(widgetOutput)
    setLoading(false)
  }

  useWidgetRefresh(true, getUserWidget, refreshFrequency)

  const isCustomColor = !Settings.userWidgetColors.includes(backgroundColor)

  const property = settings.global.backgroundColorAsForeground ? 'color' : 'backgroundColor'

  const style = settings.global.noColorInData
    ? undefined
    : { [property]: isCustomColor ? backgroundColor : `var(${backgroundColor})` }

  if (loading) return <DataWidgetLoader.Widget style={style} />

  const Icon = Icons[icon]

  const hasOnClickAction = onClickAction?.trim().length > 0
  const hasRightClickAction = onRightClickAction?.trim().length > 0
  const hasMiddleClickAction = onMiddleClickAction?.trim().length > 0

  const onClick = async (e) => {
    Utils.clickEffect(e)
    await Uebersicht.run(onClickAction)
    getUserWidget()
  }
  const onRightClick = async (e) => {
    Utils.clickEffect(e)
    await Uebersicht.run(onRightClickAction)
    getUserWidget()
  }
  const onMiddleClick = async (e) => {
    Utils.clickEffect(e)
    await Uebersicht.run(onMiddleClickAction)
    getUserWidget()
  }
  const onClickProps = {
    onClick: hasOnClickAction && onClick,
    onRightClick: hasRightClickAction && onRightClick,
    onMiddleClick: hasMiddleClickAction && onMiddleClick
  }

  return (
    <DataWidget.Widget Icon={Icon} style={style} {...onClickProps}>
      {state}
    </DataWidget.Widget>
  )
}

const UserWidgets = () => {
  const keys = Object.keys(userWidgetsList)
  return keys.map((key) => <UserWidget key={key} widget={userWidgetsList[key]} />)
}

export default UserWidgets
