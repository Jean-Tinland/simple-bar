import { classnames } from '../../utils'

const Widget = ({ Icon, className, children }) => {
  const classnames = classnames('widget', {
    [`widget--${className}`]: className
  })
  return (
    <div className={classnames}>
      {Icon && <Icon className="widget__icon" />}
      {children}
    </div>
  )
}

export default Widget
