import * as Uebersicht from 'uebersicht'
import * as Icons from '../icons.jsx'

const IconPicker = ({ callback, index, selectedIcon }) => {
  const [open, setOpen] = Uebersicht.React.useState(false)
  const [selected, setSelected] = Uebersicht.React.useState(selectedIcon)

  const Icon = Icons[selected]
  const keys = Object.keys(Icons)

  const onClick = () => setOpen(!open)

  Uebersicht.React.useEffect(() => callback?.(index, 'icon', selected), [selected])

  return (
    <div className="icon-picker">
      <button className="icon-picker__button" onClick={onClick}>
        <Icon />
      </button>
      {open && (
        <div className="icon-picker__icons" onClick={() => setOpen(false)}>
          {keys.map((key) => {
            const onClick = (e) => {
              e.stopPropagation()
              setSelected(key)
              setOpen(false)
            }
            const Icon = Icons[key]
            return (
              <button key={key} onClick={onClick}>
                <Icon />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default IconPicker
