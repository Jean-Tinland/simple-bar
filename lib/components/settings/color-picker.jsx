import * as Uebersicht from "uebersicht";
import * as Settings from "../../settings";

const { React } = Uebersicht;

/**
 * ColorPicker component allows users to select a color from predefined options or input a custom color.
 * @param {Object} props - The component props.
 * @param {Function} props.callback - The callback function to handle color selection.
 * @param {number} props.index - The index of the color picker.
 * @param {string} props.selectedColor - The initially selected color.
 * @returns {JSX.Element} The ColorPicker component.
 */
export default function ColorPicker({ callback, index, selectedColor }) {
  // Determine if the selected color is a custom color
  const isSelectedCustom = !Settings.userWidgetColors.includes(selectedColor);
  // State to manage the open/close status of the color picker
  const [open, setOpen] = React.useState(false);
  // State to manage the currently selected color
  const [selected, setSelected] = React.useState(selectedColor);
  // State to manage the custom color input
  const [customColor, setCustomColor] = React.useState(
    isSelectedCustom ? selectedColor : undefined,
  );

  // Toggle the color picker open/close status
  const onClick = () => setOpen(!open);

  /**
   * Handle custom color input change.
   * @param {Object} e - The event object.
   */
  const onCustomColorChange = (e) => {
    const value = e.target.value;
    setCustomColor(value);
    callback?.(index, "backgroundColor", value);
  };

  /**
   * Handle custom color submission.
   */
  const onCustomColorSubmit = () => {
    setSelected(customColor);
    setOpen(false);
  };

  return (
    <div className="color-picker">
      <button
        className="color-picker__button"
        style={{
          backgroundColor: isSelectedCustom ? customColor : `var(${selected})`,
        }}
        onClick={onClick}
      />
      {open && (
        <div className="color-picker__colors" onClick={() => setOpen(false)}>
          {Settings.userWidgetColors.map((color) => {
            /**
             * Handle predefined color selection.
             * @param {Object} e - The event object.
             */
            const onClick = (e) => {
              e.stopPropagation();
              setCustomColor(undefined);
              setSelected(color);
              callback?.(index, "backgroundColor", color);
              setOpen(false);
            };
            return (
              <button
                key={color}
                onClick={onClick}
                style={{ backgroundColor: `var(${color})` }}
              />
            );
          })}
          <div
            className="color-picker__custom-color"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="color-picker__custom-color-preview"
              style={{ backgroundColor: customColor }}
            />
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
            <button
              className="color-picker__custom-color-submit"
              disabled={!customColor}
              onClick={onCustomColorSubmit}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
