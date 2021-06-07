import { RemoveIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons.jsx'

import { clickEffect } from '../../utils'
import { removeSpace, swapSpace } from '../../yabai'

const SpaceOptions = ({ index, setHovered, displayIndex }) => {
  const onRemoveClick = async (e) => {
    e.stopPropagation()
    clickEffect(e)
    setHovered(false)
    await removeSpace(index, displayIndex)
  }
  const onChevronClick = (direction) => async (e) => {
    clickEffect(e)
    setHovered(false)
    await swapSpace(index, direction)
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
        <ChevronLeftIcon />
      </div>
      <div
        className="space-options__option space-options__option--move-next"
        onMouseDown={onMouseDown}
        onClick={onChevronClick('right')}
      >
        <ChevronRightIcon />
      </div>
      <div className="space-options__option space-options__option--remove" onClick={onRemoveClick}>
        <RemoveIcon />
      </div>
    </span>
  )
}

export default SpaceOptions
