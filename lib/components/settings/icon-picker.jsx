import * as Uebersicht from "uebersicht";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";

const { React } = Uebersicht;

/**
 * IconPicker component allows users to select an icon from a list of available icons.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.callback - The callback function to be called when an icon is selected.
 * @param {number} props.index - The index of the icon picker.
 * @param {string} props.selectedIcon - The initially selected icon.
 * @returns {JSX.Element} The IconPicker component.
 */
export default function IconPicker({ callback, index, selectedIcon }) {
  // State to manage the open/close state of the icon picker dropdown
  const [open, setOpen] = React.useState(false);
  // State to manage the currently selected icon
  const [selected, setSelected] = React.useState(selectedIcon);

  // Get the selected icon component
  const Icon = Icons[selected];
  // Get the list of all available icon keys
  const keys = Object.keys(Icons);

  /**
   * Toggles the open state of the icon picker dropdown.
   */
  const onClick = () => setOpen(!open);

  return (
    <div className="icon-picker">
      <button className="icon-picker__button" onClick={onClick}>
        <SuspenseIcon>
          <Icon />
        </SuspenseIcon>
      </button>
      {open && (
        <div className="icon-picker__icons" onClick={() => setOpen(false)}>
          {keys.map((key) => {
            /**
             * Handles the icon selection.
             *
             * @param {React.MouseEvent} e - The click event.
             */
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
