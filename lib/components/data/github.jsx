import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh.js";
import useServerSocket from "../../hooks/use-server-socket.js";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

export { githubStyles as styles } from "../../styles/components/data/github.js";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 1000 * 60 * 10;

/**
 * GitHub notification widget component
 * @returns {JSX.Element|null} The GitHub notification widget component
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, githubWidgetOptions } = settings;
  const { githubWidget } = widgets;
  const {
    refreshFrequency,
    showOnDisplay,
    hideWhenNoNotification,
    notificationUrl,
    ghBinaryPath,
    showIcon,
  } = githubWidgetOptions;

  const isDisabled = React.useRef(false);

  // Calculate the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && githubWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  /**
   * Reset the widget state
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetch GPU data and update the widget state
   */
  const getGitHub = React.useCallback(async () => {
    if (!visible) return;
    setLoading(true);
    const result = await Uebersicht.run(`${ghBinaryPath} api notifications`);
    if (!visible || isDisabled.current) {
      return setLoading(false);
    }
    const json = JSON.parse(result);
    const count = json.length;
    setState({ count: count > 99 ? "99+" : count });
    setLoading(false);
  }, [ghBinaryPath, visible]);

  // Update the disabled state based on visibility
  React.useEffect(() => {
    isDisabled.current = !visible;
  }, [visible]);

  // Use server socket to fetch GPU data
  useServerSocket("github", visible, getGitHub, resetWidget, setLoading);
  // Use widget refresh hook to periodically refresh the widget
  useWidgetRefresh(visible, getGitHub, refresh);

  if (loading) return <DataWidgetLoader.Widget className="github" />;
  if (!state) return null;

  const { count } = state;

  if (hideWhenNoNotification && count === 0) return null;

  return (
    <DataWidget.Widget
      classes="github"
      href={notificationUrl}
      Icon={showIcon ? Icons.GitHub : null}
      onRightClick={getGitHub}
    >
      <span className="github__count">{count}</span>
    </DataWidget.Widget>
  );
});

Widget.displayName = "GitHub";
