import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Settings from "../../settings";
import * as Utils from "../../utils";

const { React } = Uebersicht;

export default React.memo(UserWidgets);

/**
 * UserWidgets component that renders a list of user-defined widgets.
 * @returns {JSX.Element[]} Array of UserWidget components.
 */
function UserWidgets() {
  const { settings } = useSimpleBarContext();
  const { userWidgetsList } = settings.userWidgets;

  // Get the keys of the userWidgetsList object
  const keys = Object.keys(userWidgetsList);

  // Map over the keys and render a UserWidget for each key
  return keys.map((key) => (
    <UserWidget key={key} index={key} widget={userWidgetsList[key]} />
  ));
}

UserWidgets.displayName = "UserWidgets";

/**
 * UserWidget component that renders an individual user-defined widget.
 * @param {Object} props - The component props.
 * @param {string} props.index - The index of the widget.
 * @param {Object} props.widget - The widget configuration object.
 * @returns {JSX.Element|null} The rendered UserWidget component or null if not visible.
 */
const UserWidget = React.memo(({ index, widget }) => {
  const { displayIndex, settings } = useSimpleBarContext();
  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [isWidgetActive, setIsWidgetActive] = React.useState(true);
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
    hideWhenNoOutput = true,
    showOnDisplay = "",
  } = widget;

  // Determine if the widget should be visible based on display settings and active status
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && active;

  /**
   * Resets the widget state and loading status.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
    setIsWidgetActive(true);
  };

  /**
   * Fetches the widget output and updates the state.
   */
  const getUserWidget = React.useCallback(async () => {
    if (!visible) return;
    const widgetOutput = await Uebersicht.run(output);
    const cleanedOutput = Utils.cleanupOutput(widgetOutput);

    // Hide widget if script returns empty output and hideWhenNoOutput is enabled
    if (
      hideWhenNoOutput &&
      (!cleanedOutput.length || cleanedOutput.trim() === "")
    ) {
      setLoading(false);
      setIsWidgetActive(false);
      setState(undefined);
      return;
    }

    setState(widgetOutput);
    setIsWidgetActive(true);
    setLoading(false);
  }, [visible, output, hideWhenNoOutput]);

  // Use server socket to listen for widget updates
  useServerSocket(
    "user-widget",
    visible,
    getUserWidget,
    resetWidget,
    setLoading,
    index,
  );

  // Refresh the widget at the specified frequency
  useWidgetRefresh(visible, getUserWidget, refreshFrequency);

  // Hide widget if not visible or if script indicates it should be inactive (only when hideWhenNoOutput is enabled)
  if (!visible || (hideWhenNoOutput && !isWidgetActive)) return null;

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

  /**
   * Handles the click event for the widget.
   * @param {Event} e - The click event.
   */
  const onClick = async (e) => {
    Utils.clickEffect(e);
    await Uebersicht.run(onClickAction);
    getUserWidget();
  };

  /**
   * Handles the right-click event for the widget.
   * @param {Event} e - The right-click event.
   */
  const onRightClick = async (e) => {
    Utils.clickEffect(e);
    await Uebersicht.run(onRightClickAction);
    getUserWidget();
  };

  /**
   * Handles the middle-click event for the widget.
   * @param {Event} e - The middle-click event.
   */
  const onMiddleClick = async (e) => {
    Utils.clickEffect(e);
    await Uebersicht.run(onMiddleClickAction);
    getUserWidget();
  };

  const onClickProps = {
    onClick: hasOnClickAction ? onClick : undefined,
    onRightClick: hasRightClickAction ? onRightClick : undefined,
    onMiddleClick: hasMiddleClickAction ? onMiddleClick : undefined,
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
