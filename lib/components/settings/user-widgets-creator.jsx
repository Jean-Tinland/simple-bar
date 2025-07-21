import * as Uebersicht from "uebersicht";
import * as Icons from "../icons/icons.jsx";
import * as Settings from "../../settings";
import * as Utils from "../../utils";
import ColorPicker from "./color-picker.jsx";
import IconPicker from "./icon-picker.jsx";

const { React } = Uebersicht;

/**
 * UserWidgetsCreator component allows users to create and manage custom widgets.
 * @param {Object} props - The component props.
 * @param {Object} props.defaultValue - The default value for the widgets.
 * @param {Function} props.onChange - The function to call when the widgets change.
 * @returns {JSX.Element} The UserWidgetsCreator component.
 */
export default function UserWidgetsCreator({ defaultValue, onChange }) {
  const [widgets, setWidgets] = React.useState(defaultValue || {});
  const keys = Object.keys(widgets);

  // Determine the highest widget ID and calculate the new ID for a new widget
  const highestId = keys.reduce((acc, key) => {
    const keyAsNumber = parseInt(key, 10);
    return keyAsNumber > acc ? keyAsNumber : acc;
  }, 1);
  const newId = highestId + 1;

  // Function to add a new widget
  const onClick = () =>
    setWidgets((widgets) => ({
      ...widgets,
      [newId]: { ...Settings.userWidgetDefault },
    }));

  // Function to handle changes to a widget
  const onWidgetChange = (index, field, value) => {
    const newWidgets = { ...widgets };
    const newKeys = Object.keys(newWidgets);
    const updatedWidgets = newKeys.reduce((acc, key, i) => {
      const widget = newWidgets[key];
      return {
        ...acc,
        [i + 1]: key === index ? { ...widget, [field]: value } : widget,
      };
    }, {});
    setWidgets(updatedWidgets);
  };

  // Effect to detect changes in widgets and call onChange prop
  React.useEffect(() => {
    const diffs = Utils.compareObjects(defaultValue, widgets);
    const hasDiffs = Object.keys(diffs).length > 0;
    if (hasDiffs) onChange({ target: { value: widgets } });
  }, [defaultValue, onChange, widgets]);

  return (
    <div className="user-widgets-creator">
      {keys.map((key, i) => (
        <UserWidgetCreator
          key={`${key}-${widgets[key].backgroundColor}`}
          index={key}
          onWidgetChange={onWidgetChange}
          setWidgets={setWidgets}
          widget={widgets[key]}
          isFirst={i === 0}
          isLast={i === keys.length - 1}
        />
      ))}
      <button className="user-widgets-creator__add" onClick={onClick}>
        <Icons.Add />
        Add a custom widget
      </button>
    </div>
  );
}

/**
 * UserWidgetCreator component allows users to configure individual widgets.
 * @param {Object} props - The component props.
 * @param {string} props.index - The index of the widget.
 * @param {boolean} props.isFirst - Whether the widget is the first in the list.
 * @param {boolean} props.isLast - Whether the widget is the last in the list.
 * @param {Function} props.onWidgetChange - The function to call when the widget changes.
 * @param {Function} props.setWidgets - The function to set the widgets state.
 * @param {Object} props.widget - The widget data.
 * @returns {JSX.Element} The UserWidgetCreator component.
 */
function UserWidgetCreator({
  index,
  isFirst,
  isLast,
  onWidgetChange,
  setWidgets,
  widget,
}) {
  const {
    title,
    icon,
    backgroundColor,
    output,
    onClickAction,
    onRightClickAction,
    onMiddleClickAction,
    refreshFrequency,
    active = true,
    noIcon = false,
    hideWhenNoOutput = true,
    showOnDisplay = "",
  } = widget;

  const indexAsNumber = parseInt(index, 10);

  // Function to remove a widget
  const onRemoveClick = () => {
    setWidgets((widgets) => {
      const keys = Object.keys(widgets);
      return keys.reduce(
        (acc, key) => (key === index ? acc : { ...acc, [key]: widgets[key] }),
        {},
      );
    });
  };

  // Function to handle changes to widget fields
  const onChange = (field, chexbox = false) => {
    return (e) => {
      const value = (chexbox ? e?.target?.checked : e?.target?.value) ?? "";
      onWidgetChange(index, field, value);
    };
  };

  // Function to move the widget up in the list
  const onBeforeClick = () => {
    setWidgets((widgets) => {
      const swapedWidget = widgets[indexAsNumber - 1];
      return {
        ...widgets,
        [indexAsNumber - 1]: widget,
        [indexAsNumber]: swapedWidget,
      };
    });
  };

  // Function to move the widget down in the list
  const onAfterClick = () => {
    setWidgets((widgets) => {
      const swapedWidget = widgets[indexAsNumber + 1];
      return {
        ...widgets,
        [indexAsNumber + 1]: widget,
        [indexAsNumber]: swapedWidget,
      };
    });
  };

  return (
    <div key={indexAsNumber} className="user-widget-creator">
      <div className="user-widget-creator__sort-buttons">
        {!isFirst && (
          <button
            className="user-widget-creator__sort-button user-widget-creator__sort-button--before"
            onClick={onBeforeClick}
          >
            <Icons.ChevronTop />
          </button>
        )}
        {!isLast && (
          <button
            className="user-widget-creator__sort-button user-widget-creator__sort-button--after"
            onClick={onAfterClick}
          >
            <Icons.ChevronBottom />
          </button>
        )}
      </div>
      <button className="user-widget-creator__remove" onClick={onRemoveClick}>
        <Icons.Remove />
      </button>
      <div className="user-widget-creator__index">
        n°<b>{index}</b>
      </div>
      <IconPicker callback={onWidgetChange} index={index} selectedIcon={icon} />
      <div className="user-widget-creator__right">
        <div className="user-widget-creator__right-top">
          <ColorPicker
            callback={onWidgetChange}
            index={index}
            selectedColor={backgroundColor}
          />
          <input
            className="user-widget-creator__title"
            onChange={onChange("title")}
            type="text"
            defaultValue={title}
          />
          <label htmlFor={`refresh-frequency-${index}`}>
            Refresh frequency (ms):
          </label>
          <input
            className="user-widget-creator__refresh-frequency"
            onChange={onChange("refreshFrequency")}
            id={`refresh-frequency-${index}`}
            type="text"
            defaultValue={refreshFrequency}
          />
        </div>
        <div className="user-widget-creator__input-group">
          <label htmlFor={`show-on-display-${index}`}>Show on display: </label>
          <input
            className="user-widget-creator__show-on-display"
            onChange={onChange("showOnDisplay")}
            id={`show-on-display-${index}`}
            type="text"
            defaultValue={showOnDisplay}
            placeholder="example: 1,2 (leave blank to show on all displays)"
            spellCheck={false}
          />
        </div>
        <div className="user-widget-creator__input-group">
          <label htmlFor={`output-${index}`}>Command/script path: </label>
          <input
            className="user-widget-creator__output"
            onChange={onChange("output")}
            id={`output-${index}`}
            type="text"
            defaultValue={output}
            spellCheck={false}
          />
        </div>
        <div className="user-widget-creator__input-group">
          <label htmlFor={`on-click-action-${index}`}>
            On click command/script path:{" "}
          </label>
          <input
            className="user-widget-creator__on-click-action"
            onChange={onChange("onClickAction")}
            id={`on-click-action-${index}`}
            type="text"
            defaultValue={onClickAction}
            spellCheck={false}
          />
        </div>
        <div className="user-widget-creator__input-group">
          <label htmlFor={`on-right-click-action-${index}`}>
            On right click command/script path:{" "}
          </label>
          <input
            className="user-widget-creator__on-right-click-action"
            onChange={onChange("onRightClickAction")}
            id={`on-right-click-action-${index}`}
            type="text"
            defaultValue={onRightClickAction}
            spellCheck={false}
          />
        </div>
        <div className="user-widget-creator__input-group">
          <label htmlFor={`on-middle-click-action-${index}`}>
            On middle click command/script path:{" "}
          </label>
          <input
            className="user-widget-creator__on-middle-click-action"
            onChange={onChange("onMiddleClickAction")}
            id={`on-middle-click-action-${index}`}
            type="text"
            defaultValue={onMiddleClickAction}
            spellCheck={false}
          />
        </div>
        <div className="user-widget-creator__input-group">
          <input
            id={`active-${index}`}
            type="checkbox"
            defaultChecked={active}
            onChange={onChange("active", true)}
          />
          <label htmlFor={`active-${index}`}>Active</label>
          <input
            id={`no-icon-${index}`}
            type="checkbox"
            defaultChecked={noIcon}
            onChange={onChange("noIcon", true)}
          />
          <label htmlFor={`no-icon-${index}`}>No icon</label>
          <input
            id={`hide-when-no-output-${index}`}
            type="checkbox"
            defaultChecked={hideWhenNoOutput}
            onChange={onChange("hideWhenNoOutput", true)}
          />
          <label htmlFor={`hide-when-no-output-${index}`}>
            Hide when no script output
          </label>
        </div>
      </div>
    </div>
  );
}
