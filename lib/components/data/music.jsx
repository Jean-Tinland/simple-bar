import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../context.jsx";
import * as Utils from "../../utils";

export { musicStyles as styles } from "../../styles/components/data/music";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, musicWidgetOptions } = settings;
  const { musicWidget } = widgets;
  const { refreshFrequency, showSpecter, showOnDisplay } = musicWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && musicWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getMusic = React.useCallback(async () => {
    if (!visible) return;
    const osVersion = await Uebersicht.run(`sw_vers -productVersion`);
    const processName =
      Utils.cleanupOutput(osVersion) === "10.15" ? "iTunes" : "Music";
    const isRunning = await Uebersicht.run(
      `osascript -e 'tell application "System Events" to (name of processes) contains "${processName}"' 2>&1`
    );
    if (Utils.cleanupOutput(isRunning) === "false") {
      setLoading(false);
      return;
    }
    const [playerState, trackName, artistName] = await Promise.all([
      Uebersicht.run(
        `osascript -e 'tell application "${processName}" to player state as string' 2>/dev/null || echo "stopped"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "${processName}" to name of current track as string' 2>/dev/null || echo "unknown track"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "${processName}" to artist of current track as string' 2>/dev/null || echo "unknown artist"`
      ),
    ]);
    setState({
      playerState: Utils.cleanupOutput(playerState),
      trackName: Utils.cleanupOutput(trackName),
      artistName: Utils.cleanupOutput(artistName),
      processName: Utils.cleanupOutput(processName),
    });
    setLoading(false);
  }, [visible]);

  useServerSocket("music", visible, getMusic, resetWidget);
  useWidgetRefresh(visible, getMusic, refresh);

  if (loading) return <DataWidgetLoader.Widget className="music" />;
  if (!state) return null;
  const { processName, playerState, trackName, artistName } = state;

  if (!trackName.length) return null;

  const isPlaying = playerState === "playing";
  const Icon = isPlaying ? Icons.Playing : Icons.Paused;

  const onClick = (e) => {
    Utils.clickEffect(e);
    togglePlay(!isPlaying, processName);
    getMusic();
  };
  const onRightClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(
      `osascript -e 'tell application "${processName}" to Next Track'`
    );
    getMusic();
  };
  const onMiddleClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`open -a '${processName}'`);
    getMusic();
  };

  const classes = Utils.classnames("music", { "music--playing": isPlaying });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      onRightClick={onRightClick}
      onMiddleClick={onMiddleClick}
      showSpecter={showSpecter && isPlaying}
    >
      {trackName} - {artistName}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Music";

function togglePlay(isPaused, processName) {
  if (isPaused) {
    Uebersicht.run(`osascript -e 'tell application "${processName}" to play'`);
  } else {
    Uebersicht.run(`osascript -e 'tell application "${processName}" to pause'`);
  }
}
