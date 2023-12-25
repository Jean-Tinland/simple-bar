import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Settings from "../../settings";
import * as Utils from "../../utils";

const { React } = Uebersicht;

export default React.memo(UserWidgets);

function UserWidgets() {
  const { settings } = useSimpleBarContext();
  const { userWidgetsList } = settings.userWidgets;

  const keys = Object.keys(userWidgetsList);
  return keys.map((key) => (
    <UserWidget key={key} index={key} widget={userWidgetsList[key]} />
  ));
}

UserWidgets.displayName = "UserWidgets";

const UserWidget = React.memo(({ index, widget }) => {
  const { displayIndex, settings } = useSimpleBarContext();
  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const {
    icon,
    backgroundColor,
    output,
    onClickAction,
    onRightClickAction,
    onMiddleClickAction,
    refreshFrequency,
    active,
    noIcon,
    showOnDisplay = "",
  } = widget;

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && active;

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getUserWidget = React.useCallback(async () => {
    if (!visible) return;
    const widgetOutput = await Uebersicht.run(output);
    if (!Utils.cleanupOutput(widgetOutput).length) {
      setLoading(false);
      return;
    }
    setState(widgetOutput);
    setLoading(false);
  }, [visible, output]);

  useServerSocket("user-widget", visible, getUserWidget, resetWidget, index);
  useWidgetRefresh(visible, getUserWidget, refreshFrequency);

  if (!visible) return null;

  const isCustomColor = !Settings.userWidgetColors.includes(backgroundColor);

  const property = settings.global.widgetsBackgroundColorAsForeground
    ? "color"
    : "backgroundColor";

  const style = settings.global.noColorInData
    ? undefined
    : {
        [property]: isCustomColor ? backgroundColor : `var(${backgroundColor})`,
      };

  if (loading) return <DataWidgetLoader.Widget style={style} />;

  const Icon = !noIcon ? Icons[icon] : null;

  const hasOnClickAction = onClickAction?.trim().length > 0;
  const hasRightClickAction = onRightClickAction?.trim().length > 0;
  const hasMiddleClickAction = onMiddleClickAction?.trim().length > 0;

  const onClick = async (e) => {
    Utils.clickEffect(e);
    await Uebersicht.run(onClickAction);
    getUserWidget();
  };
  const onRightClick = async (e) => {
    Utils.clickEffect(e);
    await Uebersicht.run(onRightClickAction);
    getUserWidget();
  };
  const onMiddleClick = async (e) => {
    Utils.clickEffect(e);
    await Uebersicht.run(onMiddleClickAction);
    getUserWidget();
  };
  const onClickProps = {
    onClick: hasOnClickAction && onClick,
    onRightClick: hasRightClickAction && onRightClick,
    onMiddleClick: hasMiddleClickAction && onMiddleClick,
  };

  return (
    <DataWidget.Widget
      classes={`user-widget user-widget--${index}`}
      Icon={Icon}
      style={style}
      {...onClickProps}
    >
      {state}
    </DataWidget.Widget>
  );
});

UserWidget.displayName = "UserWidget";
