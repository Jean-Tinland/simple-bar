import { Remove, ChevronLeft, ChevronRight } from './Icons.jsx'

import { clickEffect } from '../utils.js'
import { removeSpace, swapSpace } from '../yabai.js'

const SpaceOptions = ({ index, displayId }) => {
  const onRemoveClick = (e) => {
    removeSpace(index, displayId)
    e.stopPropagation()
    clickEffect(e)
    const target = e.target.closest('.space')
    target.classList.remove('space--hovered')
  }
  const onChevronClick = (direction) => (e) => {
    swapSpace(index, direction)
    clickEffect(e)
    const target = e.target.closest('.space')
    target.classList.remove('space--hovered')
  }
  const onMouseDown = (e) => e.preventDefault()
  const onMouseLeave = (e) => {
    const target = e.target.closest('.space')
    target.classList.remove('space--hovered')
  }

  return (
    <span className="space-options" onMouseLeave={onMouseLeave}>
      <div
        className="space-options__option space-options__option--move-prev"
        onMouseDown={onMouseDown}
        onClick={onChevronClick('left')}
      >
        <ChevronLeft />
      </div>
      <div
        className="space-options__option space-options__option--move-next"
        onMouseDown={onMouseDown}
        onClick={onChevronClick('right')}
      >
        <ChevronRight />
      </div>
      <div className="space-options__option space-options__option--remove" onClick={onRemoveClick}>
        <Remove />
      </div>
    </span>
  )
}

export default SpaceOptions
