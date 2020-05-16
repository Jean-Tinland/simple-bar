#!/usr/bin/env bash

DISPLAYS=$(/usr/local/bin/yabai -m query --displays)
SPACES=$(/usr/local/bin/yabai -m query --spaces)

SPACES_AND_DISPLAY="{ \"displays\": $DISPLAYS, \"spaces\": $SPACES }"

echo $(cat <<-EOF
  {
    "spaces": $SPACES_AND_DISPLAY
  }
EOF
)
