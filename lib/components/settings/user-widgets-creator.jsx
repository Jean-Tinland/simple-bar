import * as Uebersicht from 'uebersicht'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import ColorPicker from './color-picker.jsx'

const UserWidgetCreator = ({ onWidgetChange, setWidgets, widget }) => {
  const { title, icon, index, backgroundColor, output, onClickAction, refreshFrequency } = widget
  const Icon = Icons[icon]

  const onRemoveClick = () => setWidgets((widgets) => widgets.filter((widget) => widget.index !== index))

  const onChange = (field) => (e) => onWidgetChange(index, field, e?.target?.value || '')

  return (
    <div className="user-widget-creator">
      <button className="user-widget-creator__remove" onClick={onRemoveClick}>
        <Icons.Remove />
      </button>
      {Icon && (
        <div className="user-widget-creator__icon">
          <Icon />
        </div>
      )}
      <div className="user-widget-creator__right">
        <div className="user-widget-creator__right-top">
          <ColorPicker callback={onWidgetChange} index={index} selectedColor={backgroundColor} />
          <input className="user-widget-creator__title" onChange={onChange('title')} type="text" defaultValue={title} />
          <label htmlFor={`refresh-frequency-${index}`}>Refresh frequency (ms):</label>
          <input
            className="user-widget-creator__refresh-frequency"
            onChange={onChange('refreshFrequency')}
            id={`refresh-frequency-${index}`}
            type="text"
            defaultValue={refreshFrequency}
          />
        </div>
        <label htmlFor={`output-${index}`}>Command/script path:</label>
        <input
          className="user-widget-creator__output"
          onChange={onChange('output')}
          id={`output-${index}`}
          type="text"
          defaultValue={output}
        />
        <label htmlFor={`on-click-action-${index}`}>On click command/script path:</label>
        <input
          className="user-widget-creator__on-click-action"
          onChange={onChange('onClickAction')}
          id={`on-click-action-${index}`}
          type="text"
          defaultValue={onClickAction}
        />
      </div>
    </div>
  )
}

const UserWidgetsCreator = ({ defaultValue, onChange }) => {
  // const firstRender = Uebersicht.React.useRef(true)
  const [widgets, setWidgets] = Uebersicht.React.useState(defaultValue || [])

  const highestId = widgets.reduce((acc, widget) => (widget.index > acc ? widget.index : acc), 0)
  const newId = highestId + 1

  const onClick = () => setWidgets((widgets) => [...widgets, { ...Settings.userWidgetDefault, index: newId }])
  const onWidgetChange = (index, field, value) => {
    const newWidgets = [...widgets].map((widget) => (widget.index === index ? { ...widget, [field]: value } : widget))
    setWidgets(newWidgets)
  }

  Uebersicht.React.useEffect(() => {
    const diffs = Utils.compareObjects(defaultValue, widgets)
    const hasDiffs = Object.keys(diffs).length > 0
    if (hasDiffs) onChange({ target: { value: widgets } })
  }, [widgets])

  return (
    <div className="user-widgets-creator">
      {widgets.map((widget, i) => (
        <UserWidgetCreator key={i} onWidgetChange={onWidgetChange} setWidgets={setWidgets} widget={widget} />
      ))}
      <button className="user-widgets-creator__add" onClick={onClick}>
        <Icons.Add />
        Add a custom widget
      </button>
    </div>
  )
}

export default UserWidgetsCreator
