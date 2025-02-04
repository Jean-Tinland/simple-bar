# Assign input arguments to variables
yabai_path=$1
display_skhd_mode=$2
disable_signals=$3
enable_window_title_changed_signal=$4

# Check if yabai is running
pgrep -x yabai > /dev/null

# If yabai is not running, output an error message and exit
if [ $? -eq 1 ]; then
  echo "yabaiError"
  exit 0
fi

# Get the System Integrity Protection (SIP) status
SIP=$(csrutil status)
# Get the current window shadow configuration from yabai
shadow_enabled=$($yabai_path -m config window_shadow)

# Query yabai for spaces, windows, and displays information
spaces=$($yabai_path -m query --spaces)
windows=$($yabai_path -m query --windows)
displays=$($yabai_path -m query --displays)

# Retry querying spaces if the initial query was empty
if [ -z "$spaces" ]; then
    spaces=$($yabai_path -m query --spaces)
fi

# Retry querying windows if the initial query was empty and remove backslashes
if [ -z "$windows" ]; then
    windows=$($yabai_path -m query --windows | sed 's/\\.//g;')
fi

# Retry querying displays if the initial query was empty
if [ -z "$displays" ]; then
    displays=$($yabai_path -m query --displays)
fi

# Add or remove signals based on the disable_signals flag
if [ $disable_signals = "false" ]; then
    # Add signals to refresh the simple-bar widget on various yabai events
    $yabai_path -m signal --add event=window_focused action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when focused application changes"
    $yabai_path -m signal --add event=window_minimized action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when a window is minimized"
    $yabai_path -m signal --add event=window_resized action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when a window is resized"
    $yabai_path -m signal --add event=window_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when an application window is closed"
    $yabai_path -m signal --add event=space_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on space change"
    $yabai_path -m signal --add event=display_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on display focus change"

    # Add signal for window title change if enabled
    if [ $enable_window_title_changed_signal = "true" ]; then
        $yabai_path -m signal --add event=window_title_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when current window title changes"
    fi

    # Add signals for space creation and destruction if yabai version is 6 or higher
    yabai_major_version=$($yabai_path -v | awk -F '.' '{print $1}' | sed 's/yabai-v//')
    if [ $yabai_major_version -ge 6 ]; then
        $yabai_path -m signal --add event=space_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on space removal"
        $yabai_path -m signal --add event=space_created action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on space creation"
    fi
else
    # Remove signals if disable_signals is true
    $yabai_path -m signal --remove label="Refresh simple-bar when focused application changes" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar when a window is minimized" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar when a window is resized" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar when an application window is closed" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar on space change" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar on display focus change" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar when current window title changes" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar on space removal" >/dev/null 2>&1 || true
    $yabai_path -m signal --remove label="Refresh simple-bar on space creation" >/dev/null 2>&1 || true
fi

# Determine skhd mode based on the display_skhd_mode flag and disable_signals flag
if [ $display_skhd_mode = "true" ]; then
  SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
  if [ $disable_signals = "false" ]; then
    skhd_mode=$(cat "$("${SCRIPT_DIR}"/yabai-set-mode.sh --query)")
  else
    skhd_mode=$(cat "$("${SCRIPT_DIR}"/yabai-set-mode-server.sh --query)")
  fi
else
  skhd_mode="{}"
fi

# Output the collected information as a JSON object
echo $(cat <<-EOF
  {
    "spaces": $spaces,
    "windows": $windows,
    "displays": $displays,
    "SIP": "$SIP",
    "shadow": "$shadow_enabled",
    "skhdMode": $skhd_mode
  }
EOF
) | \
  # Remove invisible U+200E Left-To-Right Mark character
  sed "s/\xe2\x80\x8e//g" | \
  # Remove newlines from output (handling Google Chrome JSON parse error caused by "search in page")
  tr -d '\n'
