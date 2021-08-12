import * as Icons from '../icons.jsx'
import * as Utils from '../../utils'
import * as Yabai from '../../yabai'

const SpaceOptions = ({ index, setHovered, displayIndex }) => {
  const onRemoveClick = async (e) => {
    e.stopPropagation()
    Utils.clickEffect(e)
    setHovered(false)
    await Yabai.removeSpace(index, displayIndex)
  }
  const onChevronClick = (direction) => async (e) => {
    Utils.clickEffect(e)
    setHovered(false)
    await Yabai.swapSpace(index, direction)
  }
  const onMouseDown = (e) => e.preventDefault()
  const onMouseLeave = () => setHovered(false)

  return (
    <span className="space-options" onMouseLeave={onMouseLeave}>
      <div
        className="space-options__option space-options__option--move-prev"
        onMouseDown={onMouseDown}
        onClick={onChevronClick('left')}
      >
        <Icons.ChevronLeft />
      </div>
      <div
        className="space-options__option space-options__option--move-next"
        onMouseDown={onMouseDown}
        onClick={onChevronClick('right')}
      >
        <Icons.ChevronRight />
      </div>
      <div className="space-options__option space-options__option--remove" onClick={onRemoveClick}>
        <Icons.Remove />
      </div>
    </span>
  )
}

export default SpaceOptions
