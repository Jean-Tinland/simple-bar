#!/usr/bin/env bash

PROCESS=$(/usr/local/bin/yabai -m query --windows --space)

WIFI_STATUS=$(ifconfig en0 | grep status | cut -c 10-)
WIFI_SSID=$(networksetup -getairportnetwork en0 | cut -c 24-)

echo $(cat <<-EOF
  {
    "process": $PROCESS
  }
EOF
)
