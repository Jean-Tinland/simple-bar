import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";
import * as Icons from "../icons/icons.jsx";

const { React } = Uebersicht;

/**
 * UserWidgetsCreator component allows users to create and manage custom widgets.
 * @param {Object} props - The component props.
 * @param {Object} props.defaultValue - The default value for the widgets.
 * @param {Function} props.onChange - The function to call when the widgets change.
 * @returns {JSX.Element} The UserWidgetsCreator component.
 */
export default function AerospaceDisplayManager({ defaultValue, onChange }) {
  const [indexes, setIndexes] = React.useState(defaultValue || {});
  const [displays, setDisplays] = React.useState(Object.keys(defaultValue));

  const addDisplay = () => {
    setDisplays((current) => {
      const highest = Math.max(...current, 0);
      const newIndex = highest + 1;
      setIndexes((current) => {
        return { ...current, [newIndex]: Number(current[newIndex]) || 1 };
      });
      return [...current, newIndex];
    });
  };

  const removeDisplay = (index) => {
    setDisplays((current) => {
      const newDisplays = current.filter((display) => display !== index);
      setIndexes((current) => {
        const newIndexes = { ...current };
        delete newIndexes[index];
        return newIndexes;
      });
      return newDisplays;
    });
  };

  React.useEffect(() => {
    const diffs = Utils.compareObjects(defaultValue, indexes);
    const hasDiffs = Object.keys(diffs).length > 0;
    if (hasDiffs) onChange({ target: { value: indexes } });
  }, [defaultValue, onChange, indexes]);

  return (
    <div className="aerospace-display-manager">
      <div className="aerospace-display-manager__label">
        <em>AeroSpace</em> Custom display indexes
      </div>
      <div className="aerospace-display-manager__displays">
        {displays.map((display) => {
          const index = indexes[display] || 1;

          const updateIndex = (e) => {
            const value = e.target.value;
            setIndexes((current) => {
              return { ...current, [display]: Number(value) };
            });
          };

          return (
            <div key={display} className="aerospace-display-manager__display">
              <span>{display}</span>:
              <input type="number" value={index} onChange={updateIndex} />
              <button
                className="aerospace-display-manager__remove-display"
                onClick={() => removeDisplay(display)}
              >
                <Icons.Close />
              </button>
            </div>
          );
        })}
      </div>
      <button className="aerospace-display-manager__add" onClick={addDisplay}>
        <Icons.Add />
        Add a display
      </button>
    </div>
  );
}
