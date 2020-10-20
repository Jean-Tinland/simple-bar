import { RemoveIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx'

import { clickEffect } from '../utils.js'
import { removeSpace, swapSpace } from '../yabai.js'

const SpaceOptions = ({ index, setHovered, displayId }) => {
  const onRemoveClick = (e) => {
    removeSpace(index, displayId)
    e.stopPropagation()
    clickEffect(e)
    setHovered(false)
  }
  const onChevronClick = (direction) => (e) => {
    swapSpace(index, direction)
    clickEffect(e)
    setHovered(false)
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
