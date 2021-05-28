import { React } from 'uebersicht'
import { appIcons } from '../../app-icons'
import { classnames, clickEffect } from '../../utils'
import { focusWindow } from '../../yabai'

const { useRef } = React

const Window = ({ app }) => {
  const ref = useRef()
  const { minimized, focused, app: name, title, id } = app
  if (minimized === 1) return null
  const isFocused = focused === 1
  const Icon = appIcons[name] || appIcons['Default']
  const classes = classnames('process__window', {
    'process__window--focused': isFocused
  })
  const onClick = (e) => {
    clickEffect(e)
    focusWindow(id)
  }
  const onMouseEnter = () => {
    const target = ref.current
    if (!isFocused || !target) return
    const inner = target.querySelector('.process__inner')
    const slider = target.querySelector('.process__name')
    if (!inner || !slider) return
    const delta = inner.clientWidth - slider.clientWidth
    if (delta > 0) return
    const timing = Math.round((Math.abs(delta) * 100) / 4)
    Object.assign(slider.style, {
      transform: `translateX(${delta}px)`,
      transition: `transform ${timing}ms linear`
    })
  }
  const onMouseLeave = () => {
    const target = ref.current
    if (!target) return
    const slider = target.querySelector('.process__name')
    if (!slider) return
    slider.removeAttribute('style')
  }

  return (
    <button ref={ref} className={classes} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Icon className="process__icon" />
      <span className="process__inner">
        <span className="process__name">
          {name == title ? name : `${name} / ${title}`}
        </span>
      </span>
    </button>
  )
}

export default Window
