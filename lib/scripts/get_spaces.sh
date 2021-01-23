YABAI_PATH=$1

SPACES=$($YABAI_PATH -m query --spaces)
WINDOWS=$($YABAI_PATH -m query --windows | sed 's/inf/0/g' )
WINDOWS=$(echo ${WINDOWS} | tr -d '\n')
DISPLAYS=$($YABAI_PATH -m query --displays)
SIP=$(csrutil status)

if [ -z "$SPACES" ]; then
  SPACES=$($YABAI_PATH -m query --spaces)
fi

if [ -z "$WINDOWS" ]; then
  WINDOWS=$($YABAI_PATH -m query --windows | sed 's/inf/0/g')
fi

if [ -z "$DISPLAYS" ]; then
  DISPLAYS=$($YABAI_PATH -m query --displays)
fi

echo $(cat <<-EOF
  {
    "spaces": { "spaces": $SPACES, "windows": $WINDOWS },
    "displays": $DISPLAYS,
    "SIP": "$SIP"
  }
EOF
)
