import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";

export { spotifyStyles as styles } from "../../styles/components/data/spotify";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

/**
 * Spotify widget component.
 * @returns {JSX.Element|null} The Spotify widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, spotifyWidgetOptions } = settings;
  const { spotifyWidget } = widgets;
  const { refreshFrequency, showSpecter, showOnDisplay } = spotifyWidgetOptions;

  // Determine the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  // Determine if the widget should be visible
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && spotifyWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  /**
   * Resets the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetches the current Spotify state.
   */
  const getSpotify = React.useCallback(async () => {
    if (!visible) return;
    const isRunning = await Uebersicht.run(
      `ps aux | grep -v 'grep' | grep -q '[S]potify Helper' && echo "true" || echo "false"`
    );
    if (Utils.cleanupOutput(isRunning) === "false") {
      setLoading(false);
      setState({
        playerState: "",
        trackName: "",
        artistName: "",
      });
      return;
    }
    const [playerState, trackName, artistName] = await Promise.all([
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to player state as string' 2>/dev/null || echo "stopped"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to name of current track as string' 2>/dev/null || echo "unknown track"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to artist of current track as string' 2>/dev/null || echo "unknown artist"`
      ),
    ]);
    setState({
      playerState: Utils.cleanupOutput(playerState),
      trackName: Utils.cleanupOutput(trackName),
      artistName: Utils.cleanupOutput(artistName),
    });
    setLoading(false);
  }, [visible]);

  // Set up server socket and widget refresh hooks
  useServerSocket("spotify", visible, getSpotify, resetWidget, setLoading);
  useWidgetRefresh(visible, getSpotify, refresh);

  if (loading) return <DataWidgetLoader.Widget className="spotify" />;
  if (!state) return null;
  const { playerState, trackName, artistName } = state;

  if (!trackName.length) return null;

  const label = artistName.length ? `${trackName} - ${artistName}` : trackName;
  const isPlaying = playerState === "playing";
  const Icon = getIcon(playerState);

  /**
   * Handles click event to toggle play/pause.
   * @param {React.MouseEvent} e - The click event.
   */
  const onClick = (e) => {
    Utils.clickEffect(e);
    togglePlay(!isPlaying);
    getSpotify();
  };

  /**
   * Handles right-click event to skip to the next track.
   * @param {React.MouseEvent} e - The right-click event.
   */
  const onRightClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`osascript -e 'tell application "Spotify" to Next Track'`);
    getSpotify();
  };

  /**
   * Handles middle-click event to open Spotify.
   * @param {React.MouseEvent} e - The middle-click event.
   */
  const onMiddleClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`open -a 'Spotify'`);
    getSpotify();
  };

  const classes = Utils.classNames("spotify", {
    "spotify--playing": isPlaying,
  });

  return (
    <DataWidget.Widget
      classes={classes}
      Icon={Icon}
      onClick={onClick}
      onRightClick={onRightClick}
      onMiddleClick={onMiddleClick}
      showSpecter={showSpecter && isPlaying}
    >
      {label}
    </DataWidget.Widget>
  );
});

Widget.displayName = "Spotify";

/**
 * Toggles play/pause state of Spotify.
 * @param {boolean} isPaused - Whether the player is paused.
 */
function togglePlay(isPaused) {
  const state = isPaused ? "play" : "pause";
  Uebersicht.run(`osascript -e 'tell application "Spotify" to ${state}'`);
}

/**
 * Gets the appropriate icon based on the player state.
 * @param {string} playerState - The current state of the player.
 * @returns {JSX.Element} The icon component.
 */
function getIcon(playerState) {
  if (playerState === "stopped") return Icons.Stopped;
  if (playerState === "playing") return Icons.Playing;
  return Icons.Paused;
}
