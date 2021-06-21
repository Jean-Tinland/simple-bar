import { React } from 'uebersicht'
import { classnames } from '../../utils'

const { forwardRef } = React

const getTag = (onClick, href) => {
  if (href) return 'a'
  if (onClick) return 'button'
  return 'div'
}

const DataWidget = forwardRef(({ Icon, classes, href, onClick, onMouseEnter, onMouseLeave, children }, ref) => {
  const Tag = getTag(onClick, href)
  const dataWidgetClasses = classnames('data-widget', classes, { 'data-widget--clickable': onClick })

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
})

export default DataWidget
