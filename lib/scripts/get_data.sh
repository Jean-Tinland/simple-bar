#!/usr/bin/env bash

export LC_TIME="en_US.UTF-8"
TIME=$(date +"%H:%M")

BATTERY_PERCENTAGE=$(pmset -g batt | egrep '([0-9]+\%).*' -o --colour=auto | cut -f1 -d'%')
BATTERY_STATUS=$(pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19)
BATTERY_REMAINING=$(pmset -g batt | egrep -o '([0-9]+%).*' | cut -d\  -f3)

BATTERY_CHARGING=""
if [ "$BATTERY_STATUS" == "Ba" ]; then
  BATTERY_CHARGING="false"
elif [ "$BATTERY_STATUS" == "AC" ]; then
  BATTERY_CHARGING="true"
fi

# WIFI_STATUS=$(ifconfig en0 | grep status | cut -c 10-)
# WIFI_SSID=$(networksetup -getairportnetwork en0 | cut -c 24-)

VPN_STATUS=$(osascript -e 'tell application "Viscosity" to return state of the first connection where name is equal to "office VPN"')

echo $(cat <<-EOF
  {
    "time": "$TIME",
    "battery": {
      "percentage": "$BATTERY_PERCENTAGE",
      "charging": "$BATTERY_CHARGING",
      "remaining": "$BATTERY_REMAINING"
    },
    "vpn": {
      "status": "$VPN_STATUS"
    }
  }
EOF
)
