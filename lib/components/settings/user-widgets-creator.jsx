import * as Uebersicht from 'uebersicht'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'

const UserWidgetCreator = ({ index, setWidgets, widget }) => {
  const { title, icon, backgroundColor, output, onClickAction, refreshFrequency } = widget
  const Icon = Icons[icon]

  const onRemoveClick = () => setWidgets((widgets) => widgets.filter((widget, i) => widget.index === i))

  return (
    <div className="user-widget-creator">
      <button className="user-widget-creator__remove" onClick={onRemoveClick}>
        <Icons.Remove />
      </button>
      <input className="user-widget-creator__title" type="text" value={title} />
      {Icon && (
        <div className="user-widget-creator__icon">
          <Icon />
        </div>
      )}
      <div className="user-widget-creator__background-color" style={{ backgroundColor: `var(--${backgroundColor})` }} />
      <input className="user-widget-creator__output" type="text" value={output} />
      <input className="user-widget-creator__on-click-action" type="text" value={onClickAction} />
      <input className="user-widget-creator__refresh-frequency" type="text" value={refreshFrequency} />
    </div>
  )
}

const UserWidgetsCreator = ({ defaultValue, onChange }) => {
  const [widgets, setWidgets] = Uebersicht.React.useState(defaultValue || [])

  console.log({ defaultValue })

  const onClick = () => setWidgets((widgets) => [...widgets, Settings.userWidgetDefault])

  Uebersicht.React.useEffect(() => onChange({ target: { value: widgets } }), [widgets])

  return (
    <div className="user-widgets-creator">
      {widgets.map((widget, i) => (
        <UserWidgetCreator key={i} index={i} setWidgets={setWidgets} widget={widget} />
      ))}
      <button className="user-widgets-creator__add" onClick={onClick}>
        <Icons.Add />
        Add a custom widget
      </button>
    </div>
  )
}

export default UserWidgetsCreator
