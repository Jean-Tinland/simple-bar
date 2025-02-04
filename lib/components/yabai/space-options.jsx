import * as Uebersicht from "uebersicht";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";
import * as Yabai from "../../yabai.js";

const { React } = Uebersicht;

/**
 * SpaceOptions component provides options to manipulate spaces (move left, move right, remove).
 * @param {Object} props - The component props.
 * @param {number} props.index - The index of the space.
 * @param {Function} props.setHovered - Function to set the hovered state.
 * @returns {JSX.Element} The SpaceOptions component.
 */
export default function SpaceOptions({ index, setHovered }) {
  // Get displayIndex from the context
  const { displayIndex } = useSimpleBarContext();

  /**
   * Handles the click event to remove a space.
   * @param {Event} e - The click event.
   */
  const remove = async (e) => {
    e.stopPropagation();
    Utils.clickEffect(e);
    setHovered(false);
    await Yabai.removeSpace(index, displayIndex);
  };

  /**
   * Returns a function to handle the click event to swap a space.
   * @param {string} direction - The direction to swap the space ("left" or "right").
   * @returns {Function} The click event handler.
   */
  const moveTo = (direction) => async (e) => {
    Utils.clickEffect(e);
    setHovered(false);
    await Yabai.swapSpace(index, direction);
  };

  /**
   * Prevents the default behavior of the mouse down event.
   * @param {Event} e - The mouse down event.
   */
  const onMouseDown = (e) => e.preventDefault();

  /**
   * Handles the mouse leave event to unset the hovered state.
   */
  const onMouseLeave = () => setHovered(false);

  return (
    <span className="space-options" onMouseLeave={onMouseLeave}>
      <div
        className="space-options__option space-options__option--move-prev"
        onMouseDown={onMouseDown}
        onClick={moveTo("left")}
      >
        <SuspenseIcon>
          <Icons.ChevronLeft />
        </SuspenseIcon>
      </div>
      <div
        className="space-options__option space-options__option--move-next"
        onMouseDown={onMouseDown}
        onClick={moveTo("right")}
      >
        <SuspenseIcon>
          <Icons.ChevronRight />
        </SuspenseIcon>
      </div>
      <div
        className="space-options__option space-options__option--remove"
        onClick={remove}
      >
        <SuspenseIcon>
          <Icons.Remove />
        </SuspenseIcon>
      </div>
    </span>
  );
}
