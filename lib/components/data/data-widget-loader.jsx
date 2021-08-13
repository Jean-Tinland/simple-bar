import * as Utils from '../../utils'

export { dataWidgetLoaderStyles as styles } from '../../styles/components/data/data-widget-loader'

export const Widget = ({ width = 14, height = 14, className, style }) => {
  const classes = Utils.classnames('data-widget-loader data-widget', {
    [className]: className
  })
  return (
    <div className={classes} style={style}>
      <div className="data-widget-loader__inner" style={{ width, height, flex: `0 0 ${width || height}px` }} />
    </div>
  )
}
