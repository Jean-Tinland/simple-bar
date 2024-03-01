import * as Uebersicht from "uebersicht";
import * as AppIcons from "../../app-icons";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";
import * as Yabai from "../../yabai";

const { React } = Uebersicht;

export default function Window({ window }) {
  const { settings } = useSimpleBarContext();
  const ref = React.useRef();
  const {
    displayOnlyCurrent,
    hideWindowTitle,
    displayOnlyIcon,
    expandAllProcesses,
    displayStackIndex,
    displayOnlyCurrentStack,
  } = settings.process;
  const {
    "stack-index": stackIndex,
    "is-minimized": isMinimized,
    minimized: __legacyIsMinimized,
    "has-focus": hasFocus,
    focused: __legacyHasFocus,
    app: appName,
    title,
    id,
  } = window;

  const isFocused = hasFocus ?? __legacyHasFocus;

  if (
    (isMinimized ?? __legacyIsMinimized) ||
    (displayOnlyCurrent && !isFocused)
  ) {
    return null;
  }

  const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

  const onClick = (e) => {
    !displayOnlyCurrent && Utils.clickEffect(e);
    Yabai.focusWindow(id);
  };

  const onMouseEnter = () => {
    Utils.startSliding(ref.current, ".process__inner", ".process__name");
  };

  const onMouseLeave = () => {
    Utils.stopSliding(ref.current, ".process__name");
  };

  const classes = Utils.classNames("process__window", {
    "process__window--expanded": expandAllProcesses,
    "process__window--focused": !displayOnlyCurrent && isFocused,
    "process__window--only-current": displayOnlyCurrent,
    "process__window--only-icon": displayOnlyIcon,
  });

  const cleanedUpName =
    appName !== title && title.length ? `${appName} / ${title}` : appName;
  const processName = hideWindowTitle ? appName : cleanedUpName;

  const showStackIndex =
    displayStackIndex &&
    (!displayOnlyCurrentStack || isFocused) &&
    stackIndex > 0;

  return (
    <button
      ref={ref}
      className={classes}
      onClick={onClick}
      onMouseEnter={displayOnlyIcon ? undefined : onMouseEnter}
      onMouseLeave={displayOnlyIcon ? undefined : onMouseLeave}
    >
      <Icon className="process__icon" />
      {!displayOnlyIcon && (
        <span className="process__inner">
          <span className="process__name">{processName}</span>
        </span>
      )}
      {showStackIndex && (
        <span className="process__stack-index">{stackIndex}</span>
      )}
    </button>
  );
}
