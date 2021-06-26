import { React } from 'uebersicht'
import { appIcons } from '../../app-icons'
import { getSettings } from '../../settings'
import { classnames, clickEffect, startSliding, stopSliding } from '../../utils'
import { focusWindow } from '../../yabai'

const { useRef } = React

const Window = ({ window }) => {
  const ref = useRef()
  const settings = getSettings()
  const { displayOnlyCurrent } = settings.process
  const { minimized, focused, app, title, id } = window
  if (minimized === 1 || (displayOnlyCurrent && focused !== 1)) return null
  const isFocused = focused === 1
  const Icon = appIcons[app] || appIcons['Default']
  const classes = classnames('process__window', {
    'process__window--focused': !displayOnlyCurrent && isFocused,
    'process__window--only-current': displayOnlyCurrent
  })
  const onClick = (e) => {
    !displayOnlyCurrent && clickEffect(e)
    focusWindow(id)
  }
  const onMouseEnter = () => startSliding(ref.current, '.process__inner', '.process__name')
  const onMouseLeave = () => stopSliding(ref.current, '.process__name')

  const processName = app !== title && title.length ? `${app} / ${title}` : app

  return (
    <button ref={ref} className={classes} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Icon className="process__icon" />
      <span className="process__inner">
        <span className="process__name">{processName}</span>
      </span>
    </button>
  )
}

export default Window
