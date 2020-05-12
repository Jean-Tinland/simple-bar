#!/usr/bin/env bash

DISPLAYS=$(/usr/local/bin/yabai -m query --displays)
SPACES=$(/usr/local/bin/yabai -m query --spaces)

SPACES_AND_DISPLAY="{ \"displays\": $DISPLAYS, \"spaces\": $SPACES }"
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

PROCESS_APP="$(lsappinfo info -only name `lsappinfo front`)"
PROCESS_APP=${PROCESS_APP//LSDisplayName\"=\"/ }
PROCESS_APP=${PROCESS_APP//\"/ }

echo $(cat <<-EOF
  {
    "process": {
      "app": "$PROCESS_APP",
      "title": ""
    },
    "spaces": $SPACES_AND_DISPLAY,
    "time": "$TIME",
    "battery": {
        "percentage": "$BATTERY_PERCENTAGE",
        "charging": "$BATTERY_CHARGING",
        "remaining": "$BATTERY_REMAINING"
    }
  }
EOF
)
