import * as Uebersicht from "uebersicht";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";
import * as Settings from "../../settings";
import SettingsInner from "./settings-inner.jsx";

const { React } = Uebersicht;

const settingsKeys = {
  batteryWidget: "batteryWidgetOptions",
  browserTrackWidget: "browserTrackWidgetOptions",
  cpuWidget: "cpuWidgetOptions",
  cryptoWidget: "cryptoWidgetOptions",
  dateWidget: "dateWidgetOptions",
  gpuWidget: "gpuWidgetOptions",
  memoryWidget: "memoryWidgetOptions",
  keyboardWidget: "keyboardWidgetOptions",
  micWidget: "micWidgetOptions",
  mpdWidget: "mpdWidgetOptions",
  musicWidget: "musicWidgetOptions",
  netstatsWidget: "netstatsWidgetOptions",
  soundWidget: "soundWidgetOptions",
  spotifyWidget: "spotifyWidgetOptions",
  stockWidget: "stockWidgetOptions",
  timeWidget: "timeWidgetOptions",
  vpnWidget: "vpnWidgetOptions",
  githubWidget: "githubWidgetOptions",
  weatherWidget: "weatherWidgetOptions",
  wifiWidget: "networkWidgetOptions",
  youtubeMusicWidget: "youtubeMusicWidgetOptions",
  zoomWidget: "zoomWidgetOptions",
  userWidgets: "userWidgets",
};

/**
 * SettingsWidgets component to render widgets setting category.
 * @param {Object} props - Component properties.
 * @param {Object} props.newSettings - Object containing current modified settings.
 * @param {Function} props.setNewSettings - Function allowing to save newly modified settings.
 */
export default function SettingsWidgets({ newSettings, setNewSettings }) {
  const [currentWidget, setCurrentWidget] = React.useState(null);
  const currentSetting = Settings.data[currentWidget];

  /**
   * Removes the current widget setting,
   */
  const removeCurrentWidget = () => {
    setCurrentWidget(null);
  };

  /**
   * Prevent checkbox click from propagating to the parent element,
   * allowing to avoid triggering the widget selection.
   */
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    Utils.clickEffect(e);
  };

  /**
   * Updates the current widget based on the clicked element.
   * @param {string} widget - The key of the widget to update.
   */
  const updateCurrentWidget = (widget) => (e) => {
    if (widget === "processWidget") return;

    Utils.clickEffect(e);
    const widgetKey = settingsKeys[widget];
    setCurrentWidget(currentWidget === widgetKey ? null : widgetKey);
  };

  return (
    <div className="settings__widgets">
      <Breadcrumb
        currentSetting={currentSetting}
        removeCurrentWidget={removeCurrentWidget}
      />
      {!currentWidget ? (
        <div className="settings__widgets-list">
          <div
            className="settings__widgets-item"
            onClick={updateCurrentWidget("userWidgets")}
          >
            Custom widgets
            <Icons.ChevronRight className="settings__widgets-item-icon" />
          </div>
          {Object.keys(Settings.defaultSettings.widgets).map((subKey) => {
            const subSetting = Settings.data[subKey];
            if (!subSetting) return null;
            const { label } = subSetting;
            const defaultValue = newSettings.widgets[subKey];
            const isProcess = subKey === "processWidget";

            const classes = Utils.classNames("settings__widgets-item", {
              "settings__widgets-item--process": isProcess,
            });

            const onChange = (e) => {
              const value = e.target.checked;

              const updatedSettings = {
                ...newSettings,
                widgets: { ...newSettings.widgets, [subKey]: value },
              };
              setNewSettings(updatedSettings);
            };

            return (
              <div
                key={subKey}
                className={classes}
                onClick={updateCurrentWidget(subKey)}
              >
                <input
                  type="checkbox"
                  defaultChecked={defaultValue}
                  onChange={onChange}
                  onClick={handleCheckboxClick}
                />
                {label}
                {!isProcess && (
                  <Icons.ChevronRight className="settings__widgets-item-icon" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="settings__widget-settings">
          <SettingsInner
            settingKey={currentWidget}
            setting={currentSetting}
            newSettings={newSettings}
            setNewSettings={setNewSettings}
          />
        </div>
      )}
    </div>
  );
}

/**
 * SettingsWidgets component to render widgets setting category.
 * @param {Object} props - Component properties.
 * @param {Object} props.currentSetting - Object containing the current setting.
 * @param {Function} props.removeCurrentWidget - Function removing the current setting allowing to go back to widget list.
 */
function Breadcrumb({ currentSetting, removeCurrentWidget }) {
  if (!currentSetting) {
    return (
      <div className="settings__widgets-breadcrumb">
        <div className="settings__widgets-breadcrumb-title">Widgets</div>
      </div>
    );
  }
  const { label } = currentSetting;
  return (
    <div className="settings__widgets-breadcrumb">
      <button
        className="settings__widgets-breadcrumb-title"
        onClick={removeCurrentWidget}
      >
        Widgets
      </button>
      <span className="settings__widgets-breadcrumb-current">
        {">"} {label}
      </span>
      <button
        className="settings__widgets-breadcrumb-back"
        onClick={removeCurrentWidget}
      >
        <Icons.ChevronLeft className="settings__widgets-breadcrumb-back-icon" />
        Back
      </button>
    </div>
  );
}
