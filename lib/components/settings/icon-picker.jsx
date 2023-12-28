import * as Uebersicht from "uebersicht";
import * as Icons from "../icons.jsx";

const { React } = Uebersicht;

export default function IconPicker({ callback, index, selectedIcon }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(selectedIcon);

  const Icon = Icons[selected];
  const keys = Object.keys(Icons);

  const onClick = () => setOpen(!open);

  return (
    <div className="icon-picker">
      <button className="icon-picker__button" onClick={onClick}>
        <Icon />
      </button>
      {open && (
        <div className="icon-picker__icons" onClick={() => setOpen(false)}>
          {keys.map((key) => {
            const onClick = (e) => {
              e.stopPropagation();
              setSelected(key);
              callback?.(index, "icon", key);
              setOpen(false);
            };
            const Icon = Icons[key];
            return (
              <button key={key} onClick={onClick}>
                <Icon />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
