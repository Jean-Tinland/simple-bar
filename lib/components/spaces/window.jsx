import * as Uebersicht from 'uebersicht'
import * as AppIcons from '../../app-icons'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import * as Yabai from '../../yabai'

const settings = Settings.get()

const Window = ({ window }) => {
  const ref = Uebersicht.React.useRef()
  const { displayOnlyCurrent } = settings.process
  const { minimized, focused, app, title, id } = window
  if (minimized === 1 || (displayOnlyCurrent && focused !== 1)) return null
  const isFocused = focused === 1
  const Icon = AppIcons.apps[app] || AppIcons.apps.Default
  const classes = Utils.classnames('process__window', {
    'process__window--focused': !displayOnlyCurrent && isFocused,
    'process__window--only-current': displayOnlyCurrent
  })
  const onClick = (e) => {
    !displayOnlyCurrent && Utils.clickEffect(e)
    Yabai.focusWindow(id)
  }
  const onMouseEnter = () => Utils.startSliding(ref.current, '.process__inner', '.process__name')
  const onMouseLeave = () => Utils.stopSliding(ref.current, '.process__name')

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
