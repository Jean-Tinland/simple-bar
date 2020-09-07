import { Remove, ChevronLeft, ChevronRight } from './Icons.jsx'

import { removeSpace, swapSpace } from '../yabai'

const SpaceOptions = ({ index, focusedSpace }) => {
  const onRemoveClick = (e) => {
    e.stopPropagation()
    removeSpace(index, focusedSpace)
  }
  const onChevronClick = (direction) => (e) => {
    const target = e.target.closest('.space')
    target.classList.remove('space--hovered')
    swapSpace(index, direction)
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
