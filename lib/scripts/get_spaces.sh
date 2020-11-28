SPACES=$(/usr/local/bin/yabai -m query --spaces)
WINDOWS=$(/usr/local/bin/yabai -m query --windows | sed 's/inf/0/g' )
DISPLAYS=$(/usr/local/bin/yabai -m query --displays)
SIP=$(csrutil status)

if [ -z "$SPACES" ]; then
  SPACES=$(/usr/local/bin/yabai -m query --spaces)
fi

if [ -z "$WINDOWS" ]; then
  WINDOWS=$(/usr/local/bin/yabai -m query --windows | sed 's/inf/0/g')
fi

if [ -z "$DISPLAYS" ]; then
  DISPLAYS=$(/usr/local/bin/yabai -m query --displays)
fi

echo $(cat <<-EOF
  {
    "spaces": { "spaces": $SPACES, "windows": $WINDOWS },
    "displays": $DISPLAYS,
    "SIP": "$SIP"
  }
EOF
)
