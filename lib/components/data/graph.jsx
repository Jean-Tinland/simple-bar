import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils.js";
import { SuspenseIcon } from "../icons/icon.jsx";

const { React } = Uebersicht;

export { graphStyles as styles } from "../../styles/components/data/graph";

/**
 * Graph component to display a bar graph with captions and values.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.className - Additional class names for the graph container.
 * @param {Object} props.caption - Caption data containing value, icon, and color for each key.
 * @param {Array} props.values - Array of value objects to be displayed as bars.
 * @param {number} props.maxLength - Maximum length of the graph.
 * @param {number} [props.maxValue] - Maximum value for scaling the bars.
 * @returns {JSX.Element|null} The rendered graph component or null if no caption is provided.
 */
export default function Graph({
  className,
  caption,
  values = [],
  maxLength,
  maxValue,
}) {
  // Return null if no caption is provided
  if (!caption) {
    return null;
  }

  const captionKeys = Object.keys(caption);

  // Calculate maxValue if not provided
  if (maxValue === undefined) {
    const allValues = values.map((value) => Object.values(value)).flat();
    maxValue = Math.max(...allValues);
  }

  const classes = Utils.classNames("graph", className);

  return (
    <div className={classes}>
      <div className="graph__bars">
        {values.map((value) => {
          const keys = Object.keys(value);
          return keys.map((key) => {
            const height = (value[key] / maxValue) * 100;
            const { color: backgroundColor } = caption[key];
            return (
              <div
                key={key}
                className="graph__bar"
                style={{
                  flex: `0 0 calc(100% / ${maxLength * captionKeys.length})`,
                  height: `${height}%`,
                  backgroundColor,
                }}
              />
            );
          });
        })}
      </div>
      <div className="graph__data">
        {captionKeys.map((key) => {
          const { value, icon: Icon, color } = caption[key];
          return (
            <div key={key} className="graph__data-item">
              {Icon && (
                <SuspenseIcon>
                  <Icon
                    className="graph__data-item-icon"
                    style={{ fill: color }}
                  />
                </SuspenseIcon>
              )}
              <span
                className="graph__data-item-value"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
