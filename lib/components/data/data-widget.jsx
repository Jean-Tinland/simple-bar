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

    const onClickWrapper = (e) => {
      var middle = e.button == 1 || 1 == e.button&2;
      if (middle) {
        onMiddleClick(e)
       } else {
         Utils.clickEffect(e)
         onClick(e)
       }
    }

    return (
      <Tag
        ref={ref}
        className={dataWidgetClasses}
        href={href}
        onClick={onClickWrapper}
        onContextMenu={onRightClick}
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
