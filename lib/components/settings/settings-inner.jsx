import * as Uebersicht from "uebersicht";
import * as Icons from "../icons/icons.jsx";
import SettingsItem from "./settings-item.jsx";
import * as Utils from "../../utils";
import * as Settings from "../../settings";

const { React } = Uebersicht;

/**
 * SettingsInner component to render each setting category.
 * @param {Object} props - Component properties.
 * @param {string} props.settingKey - Key of current setting.
 * @param {Object} props.setting - Contains infos & documentation data.
 * @param {string[]} props.setting.infos - Current settings information.
 * @param {string} props.setting.documentation - Current setting documentation link.
 * @param {Object} props.newSettings - Object containing current modified settings.
 * @param {Function} props.setNewSettings - Function allowing to save newly modified settings.
 */
export default function SettingsInner({
  settingKey,
  setting,
  newSettings,
  setNewSettings,
}) {
  const { infos, documentation } = setting;
  return (
    <>
      {Object.keys(Settings.defaultSettings[settingKey]).map((subKey) => {
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

        const code = settingKey + subKey;
        const defaultValue = newSettings[settingKey][subKey];

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
            [settingKey]: { ...newSettings[settingKey], [subKey]: value },
          };
          setNewSettings(updatedSettings);
        };

        return (
          <React.Fragment key={code}>
            {title && <div className="settings__item-title">{title}</div>}
            <div
              className={classes}
              onChange={type === "radio" ? onChange : undefined}
            >
              <SettingsItem
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
    </>
  );
}
