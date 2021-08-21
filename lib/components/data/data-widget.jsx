import * as Uebersicht from 'uebersicht'
import * as Utils from '../../utils'

export { dataWidgetStyles as styles } from '../../styles/components/data/data-widget'

const getTag = (onClick, href) => {
  if (href) return 'a'
  if (onClick) return 'button'
  return 'div'
}

export const Widget = Uebersicht.React.forwardRef(
  ({ Icon, classes, href, onClick, onRightClick, onMiddleClick, onMouseEnter, onMouseLeave, style, children }, ref) => {
    const Tag = getTag(onClick, href)
    const dataWidgetClasses = Utils.classnames('data-widget', classes, { 'data-widget--clickable': onClick })

    const onClickProp = (e) => {
      const { metaKey, which } = e
      const action = metaKey || which === 2 ? onMiddleClick : onClick
      if (action) action(e)
    }

    return (
      <Tag
        ref={ref}
        className={dataWidgetClasses}
        href={href}
        onClick={onClickProp}
        onContextMenu={onRightClick || undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
      >
        {Icon && <Icon />}
        {children}
      </Tag>
    )
  }
)
