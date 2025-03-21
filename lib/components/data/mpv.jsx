import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { mpvStyles as styles } from "../../styles/components/data/mpv";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 5000;

/**
 * @brief Get the current MPV title using the specified socket path
 * @param {string} socketPath - Path to the MPV socket
 * @returns {Promise<string>} The current media title
 */
async function getMpvTitle(socketPath) {
  const command = `
    SOCKET="${socketPath}"
    SOCAT="/opt/homebrew/bin/socat"
    JQ="/opt/homebrew/bin/jq"

    if [ ! -S "$SOCKET" ]; then
      echo ""
      exit 0
    fi

    TITLE=$(echo '{ "command": ["get_property", "media-title"] }' | "$SOCAT" - "$SOCKET" | "$JQ" -r '.data')

    if [ "$TITLE" != "null" ] && [ ! -z "$TITLE" ]; then
      echo "$TITLE"
    else
      echo ""
    fi
  `;

  return await Uebersicht.run(command);
}

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, mpvWidgetOptions = {} } = settings;
  const { mpvWidget } = widgets;
  const { refreshFrequency, socketPath, showOnDisplay = "" } = mpvWidgetOptions;

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && mpvWidget;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  const [state, setState] = React.useState("");
  const [loading, setLoading] = React.useState(visible);

  const getMpvInfo = React.useCallback(async () => {
    if (!visible) return;

    try {
      const output = await getMpvTitle(socketPath || "/tmp/mpv.socket");
      const cleanOutput = Utils.cleanupOutput(output);
      setState(cleanOutput || "");
      setLoading(false);
    } catch (error) {
      setState("");
      setLoading(false);
    }
  }, [visible, socketPath]);

  useWidgetRefresh(visible, getMpvInfo, refresh);

  if (!visible || !state) return null;

  if (loading) {
    return <DataWidgetLoader.Widget className="mpv-widget" />;
  }

  return (
    <DataWidget.Widget classes="mpv-widget">
      <div className="mpv-widget__content">
        <Icons.Music
          className="mpv-widget__icon"
          style={{
            width: "var(--font-size)",
            height: "var(--font-size)",
            paddingRight: "5px",
            fill: "#ffffff",
            flexShrink: 0,
            display: "inline-block",
            alignItems: "center",
          }}
        />
        <span
          className="mpv-widget__text"
          style={{
            fontFamily: "var(--font)",
            fontSize: "var(--font-size)",
            whiteSpace: "nowrap",
            maxWidth: "200px",
            minWidth: "50px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            lineHeight: 1,
            display: "inline-block",
            opacity: 1,
            visibility: "visible",
            zIndex: 3,
            textShadow: "0px 0px 1px rgba(255,255,255,0.5)",
            marginTop: "-1px",
          }}
        >
          {state}
        </span>
      </div>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Mpv";
