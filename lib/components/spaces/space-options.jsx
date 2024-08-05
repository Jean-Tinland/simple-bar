import * as Uebersicht from "uebersicht";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";
import * as Yabai from "../../yabai";

const { React } = Uebersicht;

export default function SpaceOptions({ index, setHovered }) {
  const { displayIndex } = useSimpleBarContext();

  const onRemoveClick = async (e) => {
    e.stopPropagation();
    Utils.clickEffect(e);
    setHovered(false);
    await Yabai.removeSpace(index, displayIndex);
  };

  const onChevronClick = (direction) => async (e) => {
    Utils.clickEffect(e);
    setHovered(false);
    await Yabai.swapSpace(index, direction);
  };

  const onMouseDown = (e) => e.preventDefault();
  const onMouseLeave = () => setHovered(false);

  return (
    <span className="space-options" onMouseLeave={onMouseLeave}>
      <div
        className="space-options__option space-options__option--move-prev"
        onMouseDown={onMouseDown}
        onClick={onChevronClick("left")}
      >
        <SuspenseIcon>
          <Icons.ChevronLeft />
        </SuspenseIcon>
      </div>
      <div
        className="space-options__option space-options__option--move-next"
        onMouseDown={onMouseDown}
        onClick={onChevronClick("right")}
      >
        <SuspenseIcon>
          <Icons.ChevronRight />
        </SuspenseIcon>
      </div>
      <div
        className="space-options__option space-options__option--remove"
        onClick={onRemoveClick}
      >
        <SuspenseIcon>
          <Icons.Remove />
        </SuspenseIcon>
      </div>
    </span>
  );
}
