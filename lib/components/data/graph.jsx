import * as Utils from "../../utils.js";

export { graphStyles as styles } from "../../styles/components/data/graph";

export default function Graph({
  className,
  caption,
  values = [],
  maxLength,
  maxValue,
}) {
  if (!caption) {
    return null;
  }

  const captionKeys = Object.keys(caption);
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
                <Icon
                  className="graph__data-item-icon"
                  style={{ fill: color }}
                />
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
