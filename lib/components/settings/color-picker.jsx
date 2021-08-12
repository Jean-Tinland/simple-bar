import * as Uebersicht from 'uebersicht'
import * as Settings from '../../settings'

const ColorPicker = ({ callback, index, selectedColor }) => {
  const [open, setOpen] = Uebersicht.React.useState(false)
  const [selected, setSelected] = Uebersicht.React.useState(selectedColor)
  const onClick = () => setOpen(!open)

  Uebersicht.React.useEffect(() => callback?.(index, 'backgroundColor', selected), [selected])

  return (
    <div className="color-picker">
      <button className="color-picker__button" style={{ backgroundColor: `var(--${selected})` }} onClick={onClick} />
      {open && (
        <div className="color-picker__colors" onClick={() => setOpen(false)}>
          {Settings.userWidgetColors.map((color) => {
            const onClick = (e) => {
              e.stopPropagation()
              setSelected(color)
              setOpen(false)
            }
            return <button key={color} onClick={onClick} style={{ backgroundColor: `var(--${color})` }} />
          })}
        </div>
      )}
    </div>
  )
}

export default ColorPicker
