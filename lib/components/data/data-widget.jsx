import * as Uebersicht from 'uebersicht'
import * as Specter from './specter.jsx'
import * as Utils from '../../utils'

export { dataWidgetStyles as styles } from '../../styles/components/data/data-widget'

const getTag = (onClick, href) => {
  if (href) return 'a'
  if (onClick) return 'button'
  return 'div'
}

const isMiddleClick = (e) => {
  return e.button === 1 || e['button&2'] === 1
}

const Inner = ({ disableSlider, children }) => {
  if (disableSlider) return children
  return (
    <div className="data-widget__inner">
      <div className="data-widget__slider">{children}</div>
    </div>
  )
}

export const Widget = ({
  Icon,
  classes,
  href,
  onClick,
  onRightClick,
  onMiddleClick,
  style,
  disableSlider,
  showSpecter,
  children
}) => {
  const ref = Uebersicht.React.useRef()
  const Tag = getTag(onClick, href)
  const dataWidgetClasses = Utils.classnames('data-widget', classes, { 'data-widget--clickable': onClick })

  const onClickProp = (e) => {
    const { metaKey } = e
    const action = metaKey || isMiddleClick(e) ? onMiddleClick : onClick
    if (action) action(e)
  }

  const onMouseEnter = () => Utils.startSliding(ref.current, '.data-widget__inner', '.data-widget__slider')
  const onMouseLeave = () => Utils.stopSliding(ref.current, '.data-widget__slider')

  return (
    <Tag
      ref={ref}
      className={dataWidgetClasses}
      href={href}
      onClick={onClickProp}
      onContextMenu={onRightClick || undefined}
      onMouseEnter={!disableSlider ? onMouseEnter : undefined}
      onMouseLeave={!disableSlider ? onMouseLeave : undefined}
      style={style}
    >
      {Icon && <Icon />}
      {showSpecter && <Specter.Widget />}
      <Inner disableSlider={disableSlider}>{children}</Inner>
    </Tag>
  )
}
