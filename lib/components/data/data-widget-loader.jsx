import { classnames } from '../../utils'

export { dataWidgetLoaderStyles } from '../../styles/components/data/data-widget-loader'

const DataWidgetLoader = ({ width = 14, height = 14, className }) => {
  const classes = classnames('data-widget-loader data-widget', {
    [className]: className
  })
  return (
    <div className={classes}>
      <div className="data-widget-loader__inner" style={{ width, height, flex: `0 0 ${width || height}px` }} />
    </div>
  )
}

export default DataWidgetLoader
