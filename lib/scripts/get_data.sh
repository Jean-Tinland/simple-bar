#!/usr/bin/env bash

BATTERY_PERCENTAGE=$(pmset -g batt | egrep '([0-9]+\%).*' -o --colour=auto | cut -f1 -d'%')
BATTERY_STATUS=$(pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19)
BATTERY_REMAINING=$(pmset -g batt | egrep -o '([0-9]+%).*' | cut -d\  -f3)

BATTERY_CHARGING=""
if [ "$BATTERY_STATUS" == "Ba" ]; then
  BATTERY_CHARGING="false"
elif [ "$BATTERY_STATUS" == "AC" ]; then
  BATTERY_CHARGING="true"
fi

WIFI_STATUS=$(ifconfig en0 | grep status | cut -c 10-)
WIFI_SSID=$(networksetup -getairportnetwork en0 | cut -c 24-)

VOLUME=$(osascript -e 'set ovol to output volume of (get volume settings)')
MUTED=$(osascript -e 'set ovol to output muted of (get volume settings)')

SPOTIFY_IS_RUNNING=$(osascript -e 'tell application "System Events" to (name of processes) contains "Spotify"')

if [ "$SPOTIFY_IS_RUNNING" == true ]; then
  SPOTIFY_PLAYER_STATE=$(osascript -e 'tell application "Spotify" to player state as string')
  SPOTIFY_TRACK_NAME=$(osascript -e 'tell application "Spotify" to name of current track as string')
  SPOTIFY_ARTIST_NAME=$(osascript -e 'tell application "Spotify" to artist of current track as string')
fi

echo $(cat <<-EOF
  {
    "battery": {
      "percentage": "$BATTERY_PERCENTAGE",
      "charging": "$BATTERY_CHARGING",
      "remaining": "$BATTERY_REMAINING"
    },
    "wifi": {
      "status": "$WIFI_STATUS",
      "ssid": "$WIFI_SSID"
    },
    "sound": {
      "volume": "$VOLUME",
      "muted": "$MUTED"
    },
    "spotify": {
      "spotifyIsRunning": "$SPOTIFY_IS_RUNNING",
      "playerState": "$SPOTIFY_PLAYER_STATE",
      "trackName": "$SPOTIFY_TRACK_NAME",
      "artistName": "$SPOTIFY_ARTIST_NAME"
    }
  }
EOF
)
