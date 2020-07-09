#!/usr/bin/env bash

DISPLAYS=$(/usr/local/bin/yabai -m query --displays)
SPACES=$(/usr/local/bin/yabai -m query --spaces)
WINDOWS=$(/usr/local/bin/yabai -m query --windows)
SIP=$(csrutil status)

DATA="{ \"displays\": $DISPLAYS, \"spaces\": $SPACES, \"windows\": $WINDOWS }"


echo $(cat <<-EOF
  {
    "spaces": $DATA,
    "SIP": "$SIP"
  }
EOF
)
