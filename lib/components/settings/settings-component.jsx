import * as Uebersicht from "uebersicht";
import * as Utils from "../../utils";
import SettingsInner from "./settings-inner.jsx";
import SettingsWidgets from "./settings-widgets.jsx";
import * as Settings from "../../settings";

const { React } = Uebersicht;

const TABS_STORAGE_KEY = "simple-bar-last-current-settings-tab";
const TABS = [
  "global",
  "themes",
  "process",
  "spacesDisplay",
  "widgets",
  "customStyles",
];

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
    window.sessionStorage.setItem(TABS_STORAGE_KEY, tab);
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
      [],
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
          {Object.keys(Settings.defaultSettings).map((key) => {
            const setting = Settings.data[key];
            const hideTab = !TABS.includes(key);

            if (!setting || hideTab) return null;

            const { label } = setting;
            const i = TABS.indexOf(key);
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
            const hideContent = !TABS.includes(key);

            if (!setting || hideContent) return null;

            const isWidgetsTab = key === "widgets";

            const { label } = setting;
            return (
              <div
                key={key}
                className="settings__category"
                style={{ transform: `translateX(-${100 * currentTab}%)` }}
              >
                {isWidgetsTab ? (
                  <SettingsWidgets
                    newSettings={newSettings}
                    setNewSettings={setNewSettings}
                  />
                ) : (
                  <React.Fragment>
                    <div className="settings__inner-title">{label}</div>
                    <SettingsInner
                      settingKey={key}
                      setting={setting}
                      newSettings={newSettings}
                      setNewSettings={setNewSettings}
                    />
                  </React.Fragment>
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
 * Get the last current tab from session storage.
 * @returns {number} The index of the last current tab.
 */
function getLastCurrentTab() {
  const storedLastCurrentTab = window.sessionStorage.getItem(TABS_STORAGE_KEY);
  if (storedLastCurrentTab) return parseInt(storedLastCurrentTab, 10);
  return 0;
}
