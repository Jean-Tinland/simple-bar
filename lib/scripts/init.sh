YABAI_PATH=$1

SPACES=$($YABAI_PATH -m query --spaces)
WINDOWS=$($YABAI_PATH -m query --windows | sed 's/inf/0/g; s/\\.//g; s/\n//g')
DISPLAYS=$($YABAI_PATH -m query --displays)
SIP=$(csrutil status)
SHADOW=$($YABAI_PATH -m config window_shadow)

if [ -z "$SPACES" ]; then
  SPACES=$($YABAI_PATH -m query --spaces)
fi

if [ -z "$WINDOWS" ]; then
  WINDOWS=$($YABAI_PATH -m query --windows | sed 's/inf/0/g; s/\\.//g; s/\n//g')
fi

if [ -z "$DISPLAYS" ]; then
  DISPLAYS=$($YABAI_PATH -m query --displays)
fi

$YABAI_PATH -m signal --add event=space_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar on space change"
$YABAI_PATH -m signal --add event=display_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar on display focus change"
$YABAI_PATH -m signal --add event=window_focused action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar when focused application changes"
$YABAI_PATH -m signal --add event=window_resized action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar when a window is resized"
$YABAI_PATH -m signal --add event=application_front_switched action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar when front application switched application changes"
$YABAI_PATH -m signal --add event=window_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar when an application window is closed"
$YABAI_PATH -m signal --add event=window_title_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'" label="Refresh simple-bar when current window title changes"

echo $(cat <<-EOF
  {
    "spaces": { "spaces": $SPACES, "windows": $WINDOWS },
    "displays": $DISPLAYS,
    "SIP": "$SIP",
    "shadow": "$SHADOW"
  }
EOF
)
