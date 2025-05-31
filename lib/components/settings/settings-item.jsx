import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";

const { React } = Uebersicht;

/**
 * Item component to render different types of settings inputs.
 * @param {Object} props - Component properties.
 * @param {string} props.code - Unique code for the setting.
 * @param {React.Component} props.Component - Custom component for the setting.
 * @param {any} props.defaultValue - Default value of the setting.
 * @param {string} props.label - Label for the setting.
 * @param {string} props.type - Type of the setting input.
 * @param {Array} [props.options] - Options for select or radio inputs.
 * @param {string} [props.placeholder] - Placeholder for text inputs.
 * @param {number} [props.minHeight] - Minimum height for textarea inputs.
 * @param {Function} props.onChange - Change handler for the setting input.
 */
export default function SettingsItem({
  code,
  Component,
  defaultValue,
  label,
  type,
  options,
  placeholder,
  minHeight,
  onChange,
}) {
  const onClick = (e) => Utils.clickEffect(e);
  if (type === "component") {
    return <Component defaultValue={defaultValue} onChange={onChange} />;
  }
  if (type === "select") {
    return (
      <React.Fragment>
        <label htmlFor={code} dangerouslySetInnerHTML={{ __html: label }} />
        <select
          id={code}
          className="settings__select"
          onChange={onChange}
          defaultValue={defaultValue}
        >
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </React.Fragment>
    );
  }
  if (type === "radio") {
    return options.map((option) => (
      <div className="settings__item-option" key={option} onClick={onClick}>
        <input
          name={code}
          id={option}
          value={option}
          type="radio"
          defaultChecked={option === defaultValue}
        />
        <label
          htmlFor={option}
          dangerouslySetInnerHTML={{ __html: `${option} ${label}` }}
        />
      </div>
    ));
  }
  if (type === "text" || type === "color") {
    return (
      <React.Fragment>
        <label htmlFor={code} dangerouslySetInnerHTML={{ __html: label }} />
        {type === "color" && (
          <div
            className="settings__item-color-pill"
            style={{ backgroundColor: defaultValue || "transparent" }}
          />
        )}
        <input
          id={code}
          type="text"
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </React.Fragment>
    );
  }
  if (type === "number") {
    return (
      <React.Fragment>
        <label htmlFor={code} dangerouslySetInnerHTML={{ __html: label }} />
        <input
          id={code}
          type="number"
          value={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
        />
      </React.Fragment>
    );
  }
  if (type === "textarea") {
    return (
      <React.Fragment>
        <label htmlFor={code} dangerouslySetInnerHTML={{ __html: label }} />
        <textarea
          id={code}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{ minHeight }}
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <input
        id={code}
        type="checkbox"
        defaultChecked={defaultValue}
        onChange={onChange}
        onClick={onClick}
      />
      <label
        htmlFor={code}
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </React.Fragment>
  );
}
