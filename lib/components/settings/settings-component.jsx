import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";
import * as Icons from "../icons/icons.jsx";
import * as Settings from "../../settings";

const { React } = Uebersicht;

const LAST_CURRENT_TAB = "simple-bar-last-current-settings-tab";

/**
 * Main settings component.
 * @param {Object} props - Component properties.
 * @param {Function} props.closeSettings - Function to close the settings.
 */
export default function Component({ closeSettings }) {
  // State to keep track of the current tab
  const [currentTab, setCurrentTab] = React.useState(getLastCurrentTab());
  // State to keep track of pending changes
  const [pendingChanges, setPendingChanges] = React.useState(0);
  // Get current settings
  const settings = Settings.get();
  // State to keep track of new settings
  const [newSettings, setNewSettings] = React.useState(settings);

  /**
   * Update the current tab and store it in session storage.
   * @param {number} tab - The index of the tab to switch to.
   */
  const updateTab = (tab) => {
    setCurrentTab(tab);
    window.sessionStorage.setItem(LAST_CURRENT_TAB, tab);
  };

  /**
   * Refresh the simple-bar with new settings.
   * @param {Event} e - The event object.
   */
  const refreshSimpleBar = async (e) => {
    Utils.clickEffect(e);
    setPendingChanges(0);
    await Settings.set(newSettings);
    Utils.hardRefresh();
  };

  // Effect to calculate the number of pending changes
  React.useEffect(() => {
    const diffs = Utils.compareObjects(settings, newSettings);
    const deepDiffs = Object.keys(diffs).reduce(
      (acc, key) => [...acc, ...Object.keys(diffs[key])],
      []
    );
    setPendingChanges(deepDiffs.length);
  }, [newSettings, settings]);

  return (
    <div className="settings">
      <div className="settings__overlay" onClick={closeSettings} />
      <div className="settings__outer">
        <div className="settings__header">
          <button
            className="settings__header-dot settings__header-dot--close"
            onClick={closeSettings}
          />
          <span className="settings__header-dot settings__header-dot--disabled" />
          <span className="settings__header-dot settings__header-dot--disabled" />
          Settings
        </div>
        <div className="settings__tabs">
          {Object.keys(Settings.defaultSettings).map((key, i) => {
            const setting = Settings.data[key];
            if (!setting) return null;
            const { label } = setting;
            const classes = Utils.classNames("settings__tab", {
              "settings__tab--current": i === currentTab,
            });
            return (
              <button key={i} className={classes} onClick={() => updateTab(i)}>
                {label}
              </button>
            );
          })}
        </div>
        <div className="settings__inner">
          {Object.keys(Settings.defaultSettings).map((key) => {
            const setting = Settings.data[key];
            if (!setting) return null;
            const { label, infos, documentation } = setting;
            return (
              <div
                key={key}
                className="settings__category"
                style={{ transform: `translateX(-${100 * currentTab}%)` }}
              >
                <div className="settings__inner-title">{label}</div>
                {Object.keys(Settings.defaultSettings[key]).map((subKey) => {
                  const subSetting = Settings.data[subKey];
                  if (!subSetting) return null;
                  const {
                    Component,
                    fullWidth,
                    label,
                    options,
                    placeholder,
                    title,
                    type,
                    minHeight,
                  } = subSetting;

                  const code = key + subKey;
                  const defaultValue = newSettings[key][subKey];

                  const classes = Utils.classNames("settings__item", {
                    "settings__item--radio": type === "radio",
                    "settings__item--text":
                      type === "text" || type === "number" || type === "color",
                    "settings__item--textarea": type === "textarea",
                    "settings__item--color": type === "color",
                    "settings__item--full-width": fullWidth,
                  });

                  const onChange = (e) => {
                    let value = e.target.value;
                    if (type === "checkbox") {
                      value = e.target.checked;
                    }
                    if (type === "number") {
                      value = parseFloat(value);
                      if (isNaN(value)) {
                        value = 0;
                      }
                    }

                    const updatedSettings = {
                      ...newSettings,
                      [key]: { ...newSettings[key], [subKey]: value },
                    };
                    setNewSettings(updatedSettings);
                  };

                  return (
                    <React.Fragment key={code}>
                      {title && (
                        <div className="settings__item-title">{title}</div>
                      )}
                      <div
                        className={classes}
                        onChange={type === "radio" ? onChange : undefined}
                      >
                        <Item
                          code={code}
                          Component={Component}
                          defaultValue={defaultValue}
                          label={label}
                          onChange={onChange}
                          options={options}
                          placeholder={placeholder}
                          type={type}
                          minHeight={minHeight}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
                {documentation && (
                  <div className="settings__documentation">
                    <Icons.OpenBook className="settings__documentation-icon" />
                    <span className="settings__documentation-title">
                      You{"'"}ll find all the information about these settings{" "}
                      <a
                        href={`https://www.jeantinland.com/toolbox/simple-bar/documentation${documentation}`}
                      >
                        here on the documentation
                      </a>{" "}
                      hosted on jeantinland.com.
                    </span>
                  </div>
                )}
                {infos && infos.length && (
                  <div className="settings__infos">
                    <div className="settings__infos-title">Tips</div>
                    {infos.map((info, i) => (
                      <div
                        key={i}
                        className="settings__info"
                        dangerouslySetInnerHTML={{ __html: info }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="settings__bottom">
          {pendingChanges !== 0 && (
            <div className="settings__pending-changes">
              <b>{pendingChanges}</b> pending change{pendingChanges > 1 && "s"}
            </div>
          )}
          <button
            className="settings__refresh-button"
            onClick={refreshSimpleBar}
            disabled={!pendingChanges}
          >
            Confirm changes and refresh simple-bar
          </button>
        </div>
      </div>
    </div>
  );
}

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
function Item({
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

/**
 * Get the last current tab from session storage.
 * @returns {number} The index of the last current tab.
 */
function getLastCurrentTab() {
  const storedLastCurrentTab = window.sessionStorage.getItem(LAST_CURRENT_TAB);
  if (storedLastCurrentTab) return parseInt(storedLastCurrentTab, 10);
  return 0;
}
