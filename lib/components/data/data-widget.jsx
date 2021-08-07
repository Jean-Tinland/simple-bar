import * as Uebersicht from 'uebersicht'
import * as Utils from '../../utils'

export { dataWidgetStyles as styles } from '../../styles/components/data/data-widget'

const getTag = (onClick, href) => {
  if (href) return 'a'
  if (onClick) return 'button'
  return 'div'
}

export const Widget = Uebersicht.React.forwardRef(
  ({ Icon, classes, href, onClick, onMouseEnter, onMouseLeave, children }, ref) => {
    const Tag = getTag(onClick, href)
    const dataWidgetClasses = Utils.classnames('data-widget', classes, { 'data-widget--clickable': onClick })

    return (
      <Tag
        ref={ref}
        className={dataWidgetClasses}
        href={href}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {Icon && <Icon />}
        {children}
      </Tag>
    )
  }
)
