import * as Uebersicht from 'uebersicht'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import ColorPicker from './color-picker.jsx'
import IconPicker from './icon-picker.jsx'

const UserWidgetCreator = ({ index, isFirst, isLast, onWidgetChange, setWidgets, widget }) => {
  const {
    title,
    icon,
    backgroundColor,
    output,
    onClickAction,
    onRightClickAction,
    onMiddleClickAction,
    refreshFrequency
  } = widget

  const indexAsNumber = parseInt(index)

  const onRemoveClick = () => {
    setWidgets((widgets) => {
      const keys = Object.keys(widgets)
      return keys.reduce((acc, key) => (key === index ? acc : { ...acc, [key]: widgets[key] }), {})
    })
  }

  const onChange = (field) => (e) => onWidgetChange(index, field, e?.target?.value || '')

  const onBeforeClick = () => {
    setWidgets((widgets) => {
      const swapedWidget = widgets[indexAsNumber - 1]
      return { ...widgets, [indexAsNumber - 1]: widget, [indexAsNumber]: swapedWidget }
    })
  }

  const onAfterClick = () => {
    setWidgets((widgets) => {
      const swapedWidget = widgets[indexAsNumber + 1]
      return { ...widgets, [indexAsNumber + 1]: widget, [indexAsNumber]: swapedWidget }
    })
  }

  return (
    <div key={indexAsNumber} className="user-widget-creator">
      <div className="user-widget-creator__sort-buttons">
        {!isFirst && (
          <button
            className="user-widget-creator__sort-button user-widget-creator__sort-button--before"
            onClick={onBeforeClick}
          >
            <Icons.ChevronTop />
          </button>
        )}
        {!isLast && (
          <button
            className="user-widget-creator__sort-button user-widget-creator__sort-button--after"
            onClick={onAfterClick}
          >
            <Icons.ChevronBottom />
          </button>
        )}
      </div>
      <button className="user-widget-creator__remove" onClick={onRemoveClick}>
        <Icons.Remove />
      </button>
      <IconPicker callback={onWidgetChange} index={index} selectedIcon={icon} />
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
          spellCheck={false}
        />
        <label htmlFor={`on-click-action-${index}`}>On click command/script path:</label>
        <input
          className="user-widget-creator__on-click-action"
          onChange={onChange('onClickAction')}
          id={`on-click-action-${index}`}
          type="text"
          defaultValue={onClickAction}
          spellCheck={false}
        />
        <label htmlFor={`on-right-click-action-${index}`}>On right click command/script path:</label>
        <input
          className="user-widget-creator__on-right-click-action"
          onChange={onChange('onRightClickAction')}
          id={`on-right-click-action-${index}`}
          type="text"
          defaultValue={onRightClickAction}
          spellCheck={false}
        />
        <label htmlFor={`on-Middle-click-action-${index}`}>On middle click command/script path:</label>
        <input
          className="user-widget-creator__on-middle-click-action"
          onChange={onChange('onMiddleClickAction')}
          id={`on-middle-click-action-${index}`}
          type="text"
          defaultValue={onMiddleClickAction}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

const UserWidgetsCreator = ({ defaultValue, onChange }) => {
  const [widgets, setWidgets] = Uebersicht.React.useState(defaultValue || {})
  const keys = Object.keys(widgets)

  const highestId = keys.reduce((acc, key) => {
    const keyAsNumber = parseInt(key)
    return keyAsNumber > acc ? keyAsNumber : acc
  }, 1)
  const newId = highestId + 1

  const onClick = () => setWidgets((widgets) => ({ ...widgets, [newId]: { ...Settings.userWidgetDefault } }))
  const onWidgetChange = (index, field, value) => {
    const newWidgets = { ...widgets }
    const newKeys = Object.keys(newWidgets)
    const updatedWidgets = newKeys.reduce((acc, key, i) => {
      const widget = newWidgets[key]
      return { ...acc, [i + 1]: key === index ? { ...widget, [field]: value } : widget }
    }, {})
    setWidgets(updatedWidgets)
  }

  Uebersicht.React.useEffect(() => {
    const diffs = Utils.compareObjects(defaultValue, widgets)
    const hasDiffs = Object.keys(diffs).length > 0
    if (hasDiffs) onChange({ target: { value: widgets } })
  }, [widgets])

  return (
    <div className="user-widgets-creator">
      {keys.map((key, i) => (
        <UserWidgetCreator
          key={`${key}-${widgets[key].backgroundColor}`}
          index={key}
          onWidgetChange={onWidgetChange}
          setWidgets={setWidgets}
          widget={widgets[key]}
          isFirst={i === 0}
          isLast={i === keys.length - 1}
        />
      ))}
      <button className="user-widgets-creator__add" onClick={onClick}>
        <Icons.Add />
        Add a custom widget
      </button>
    </div>
  )
}

export default UserWidgetsCreator
