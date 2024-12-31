import * as Uebersicht from "uebersicht";
import * as AppIcons from "../../app-icons";
import { SuspenseIcon } from "../icons/icon.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";
import * as Aerospace from "../../aerospace";

const { React } = Uebersicht;

export default function Window({ window }) {
  const { settings } = useSimpleBarContext();
  const ref = React.useRef();
  const {
    displayOnlyCurrent,
    hideWindowTitle,
    displayOnlyIcon,
    expandAllProcesses,
  } = settings.process;
  const {
    focused,
    "app-name": appName,
    "window-title": title,
    "window-id": id,
  } = window;

  if (displayOnlyCurrent && !focused) {
    return null;
  }

  const Icon = AppIcons.apps[appName] || AppIcons.apps.Default;

  const onClick = (e) => {
    !displayOnlyCurrent && Utils.clickEffect(e);
    Aerospace.focusWindow(id);
  };

  const onMouseEnter = () => {
    Utils.startSliding(ref.current, ".process__inner", ".process__name");
  };

  const onMouseLeave = () => {
    Utils.stopSliding(ref.current, ".process__name");
  };

  const classes = Utils.classNames("process__window", {
    "process__window--expanded": expandAllProcesses,
    "process__window--focused": !displayOnlyCurrent && focused,
    "process__window--only-current": displayOnlyCurrent,
    "process__window--only-icon": displayOnlyIcon,
  });

  const cleanedUpName =
    appName !== title && title.length ? `${appName} / ${title}` : appName;
  const processName = hideWindowTitle ? appName : cleanedUpName;

  return (
    <button
      ref={ref}
      className={classes}
      onClick={onClick}
      onMouseEnter={displayOnlyIcon ? undefined : onMouseEnter}
      onMouseLeave={displayOnlyIcon ? undefined : onMouseLeave}
    >
      <SuspenseIcon>
        <Icon className="process__icon" />
      </SuspenseIcon>
      {!displayOnlyIcon && (
        <span className="process__inner">
          <span className="process__name">{processName}</span>
        </span>
      )}
    </button>
  );
}
