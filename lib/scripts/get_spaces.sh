#!/usr/bin/env bash

DISPLAYS=$(/usr/local/bin/yabai -m query --displays)
SPACES=$(/usr/local/bin/yabai -m query --spaces)
WINDOWS=$(/usr/local/bin/yabai -m query --windows)

DATA="{ \"displays\": $DISPLAYS, \"spaces\": $SPACES, \"windows\": $WINDOWS }"


echo $(cat <<-EOF
  {
    "spaces": $DATA
  }
EOF
)
