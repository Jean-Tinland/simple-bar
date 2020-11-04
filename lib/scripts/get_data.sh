ACTIVE_WIDGETS="$1"

contains() {
    if printf '%s\n' "$1" | grep -Fqe "$2"; then
      return 1
    else
      return 0
    fi
}

if contains $ACTIVE_WIDGETS "batteryWidget"
  then
    BATTERY_PERCENTAGE=$(pmset -g batt | egrep '([0-9]+\%).*' -o --colour=auto | cut -f1 -d'%')
    BATTERY_STATUS=$(pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19)
    
    CAFFEINATE=caffeinate
    CAFFEINATE_PID=""
  if pgrep $CAFFEINATE 2>&1 >/dev/null; then
    CAFFEINATE_PID=$(pgrep $CAFFEINATE)
  fi

  BATTERY_CHARGING=""
  if [ "$BATTERY_STATUS" = "Ba" ]; then
    BATTERY_CHARGING="false"
  elif [ "$BATTERY_STATUS" = "AC" ]; then
    BATTERY_CHARGING="true"
  fi
fi

if contains $ACTIVE_WIDGETS "wifiWidget"
  then
    WIFI_STATUS=$(ifconfig en0 | grep status | cut -c 10-)
    WIFI_SSID=$(networksetup -getairportnetwork en0 | cut -c 24-)
fi

if contains $ACTIVE_WIDGETS "soundWidget"
  then
    VOLUME=$(osascript -e 'set ovol to output volume of (get volume settings)')
    MUTED=$(osascript -e 'set ovol to output muted of (get volume settings)')
fi

if contains $ACTIVE_WIDGETS "micWidget" 
  then
    MIC=$(osascript -e 'set ovol to input volume of (get volume settings)')
fi

if contains $ACTIVE_WIDGETS "spotifyWidget"
  then
    SPOTIFY_IS_RUNNING=$(osascript -e 'tell application "System Events" to (name of processes) contains "Spotify"' 2>&1)

    if [ "$SPOTIFY_IS_RUNNING" = true ]; then
      SPOTIFY_PLAYER_STATE=$(osascript -e 'tell application "Spotify" to player state as string')
      SPOTIFY_TRACK_NAME=$(osascript -e 'tell application "Spotify" to name of current track as string' | tr \" \')
      SPOTIFY_ARTIST_NAME=$(osascript -e 'tell application "Spotify" to artist of current track as string' | tr \" \')
    fi
fi

if contains $ACTIVE_WIDGETS "musicWidget"
  then
    MUSIC_PROCESS="Music"
    if contains $(sw_vers -productVersion) "10.15"
      then
        MUSIC_PROCESS="iTunes"
    fi

    MUSIC_IS_RUNNING=$(osascript -e 'tell application "System Events" to (name of processes) contains "'$MUSIC_PROCESS'"' 2>&1)

    if [ "$MUSIC_IS_RUNNING" = true ]; then
      MUSIC_PLAYER_STATE=$(osascript -e 'tell application "'$MUSIC_PROCESS'" to player state as string')
      MUSIC_TRACK_NAME=$(osascript -e 'tell application "'$MUSIC_PROCESS'" to name of current track as string' | tr \" \')
      MUSIC_ARTIST_NAME=$(osascript -e 'tell application "'$MUSIC_PROCESS'" to artist of current track as string' | tr \" \')
    fi
fi

BROWSER_TRACK="{}"
if contains $ACTIVE_WIDGETS "browserTrackWidget"
  then
    if GET_BROWSER_TRACK=$(osascript ./simple-bar/lib/scripts/browser_audio.applescript 2>&1); then
      BROWSER_TRACK=$GET_BROWSER_TRACK
    fi
fi

echo $(cat <<-EOF
  {
    "battery": {
      "percentage": "$BATTERY_PERCENTAGE",
      "charging": "$BATTERY_CHARGING",
      "caffeinate": "$CAFFEINATE_PID"
    },
    "wifi": {
      "status": "$WIFI_STATUS",
      "ssid": "$WIFI_SSID"
    },
    "sound": {
      "volume": "$VOLUME",
      "muted": "$MUTED"
    },
    "mic": {
      "volume": "$MIC"
    },
    "spotify": {
      "spotifyIsRunning": "$SPOTIFY_IS_RUNNING",
      "playerState": "$SPOTIFY_PLAYER_STATE",
      "trackName": "$SPOTIFY_TRACK_NAME",
      "artistName": "$SPOTIFY_ARTIST_NAME"
    },
    "music": {
      "processName": "$MUSIC_PROCESS",
      "musicIsRunning": "$MUSIC_IS_RUNNING",
      "playerState": "$MUSIC_PLAYER_STATE",
      "trackName": "$MUSIC_TRACK_NAME",
      "artistName": "$MUSIC_ARTIST_NAME"
    },
    "browserTrack": $BROWSER_TRACK
  }
EOF
)
