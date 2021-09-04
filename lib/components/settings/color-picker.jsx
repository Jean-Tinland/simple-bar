import * as Uebersicht from 'uebersicht'
import * as Settings from '../../settings'

const ColorPicker = ({ callback, index, selectedColor }) => {
  const isSelectedCustom = !Settings.userWidgetColors.includes(selectedColor)
  const [open, setOpen] = Uebersicht.React.useState(false)
  const [selected, setSelected] = Uebersicht.React.useState(selectedColor)
  const [customColor, setCustomColor] = Uebersicht.React.useState(isSelectedCustom ? selectedColor : undefined)

  const onClick = () => setOpen(!open)

  const onCustomColorChange = (e) => setCustomColor(e.target.value)
  const onCustomColorSubmit = () => {
    setSelected(customColor)
    setOpen(false)
  }

  Uebersicht.React.useEffect(() => callback?.(index, 'backgroundColor', selected), [selected])

  return (
    <div className="color-picker">
      <button
        className="color-picker__button"
        style={{ backgroundColor: isSelectedCustom ? customColor : `var(${selected})` }}
        onClick={onClick}
      />
      {open && (
        <div className="color-picker__colors" onClick={() => setOpen(false)}>
          {Settings.userWidgetColors.map((color) => {
            const onClick = (e) => {
              e.stopPropagation()
              setCustomColor(undefined)
              setSelected(color)
              setOpen(false)
            }
            return <button key={color} onClick={onClick} style={{ backgroundColor: `var(${color})` }} />
          })}
          <div className="color-picker__custom-color" onClick={(e) => e.stopPropagation()}>
            <div className="color-picker__custom-color-preview" style={{ backgroundColor: customColor }} />
            <input
              type="text"
              className="color-picker__custom-color-input"
              placeholder="Or any valid css color value (hex, rgb-a, hsl)"
              onChange={onCustomColorChange}
              defaultValue={customColor}
              autoCapitalize="false"
              autoComplete="false"
              autoCorrect="false"
              spellCheck={false}
            />
            <button className="color-picker__custom-color-submit" disabled={!customColor} onClick={onCustomColorSubmit}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
