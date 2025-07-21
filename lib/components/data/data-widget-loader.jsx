import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";

export { dataWidgetLoaderStyles as styles } from "../../styles/components/data/data-widget-loader";

const { React } = Uebersicht;

/**
 * A memoized React component that renders a data widget loader.
 *
 * @param {Object} props - The properties object.
 * @param {number} [props.width=14] - The width of the loader.
 * @param {number} [props.height=14] - The height of the loader.
 * @param {string} [props.className] - Additional class names for the loader.
 * @param {Object} [props.style] - Additional styles for the loader.
 * @returns {JSX.Element} The rendered data widget loader component.
 */
export const Widget = React.memo(
  ({ width = 14, height = 14, className, style }) => {
    // Generate class names using the Utils.classNames function
    const classes = Utils.classNames("data-widget-loader", "data-widget", {
      [className]: className,
    });

    // Return the JSX for the data widget loader
    return (
      <div className={classes} style={style}>
        <div
          className="data-widget-loader__inner"
          style={{ width, height, flex: `0 0 ${width || height}px` }}
        />
      </div>
    );
  },
);

Widget.displayName = "DataWidgetLoader";
