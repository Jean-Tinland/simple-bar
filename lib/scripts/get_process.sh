#!/usr/bin/env bash

PROCESS=$(/usr/local/bin/yabai -m query --windows --space)

echo $(cat <<-EOF
  {
    "process": $PROCESS
  }
EOF
)
