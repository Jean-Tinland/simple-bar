display_skhd_mode=$1
disable_signals=$2
enable_window_title_changed_signal=$3

pgrep -x yabai > /dev/null

if [ $? -eq 1 ]; then
  echo "yabaiError"
  exit 0
fi

SIP=$(csrutil status)
shadow_enabled=$($(which yabai) -m config window_shadow)

spaces=$($(which yabai) -m query --spaces)
windows=$($(which yabai) -m query --windows)
displays=$($(which yabai) -m query --displays)

if [ -z "$spaces" ]; then
    spaces=$($(which yabai) -m query --spaces)
fi

if [ -z "$windows" ]; then
    windows=$($(which yabai) -m query --windows | sed 's/\\.//g;')
fi

if [ -z "$displays" ]; then
    displays=$($(which yabai) -m query --displays)
fi
if [ $disable_signals = "false" ]; then
    $(which yabai) -m signal --add event=window_focused action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when focused application changes"
    $(which yabai) -m signal --add event=window_minimized action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when a window is minimized"
    $(which yabai) -m signal --add event=window_resized action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when a window is resized"
    $(which yabai) -m signal --add event=window_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when an application window is closed"
    $(which yabai) -m signal --add event=space_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on space change"
    $(which yabai) -m signal --add event=display_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on display focus change"

    if [ $enable_window_title_changed_signal = "true" ]; then
        $(which yabai) -m signal --add event=window_title_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar when current window title changes"
    fi

    yabai_major_version=$($(which yabai) -v | awk -F '.' '{print $1}' | sed 's/yabai-v//')
    if [ $yabai_major_version -ge 6 ]; then
        $(which yabai) -m signal --add event=space_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on space removal"
        $(which yabai) -m signal --add event=space_created action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-index-jsx\"'" label="Refresh simple-bar on space creation"
    fi
else
    $(which yabai) -m signal --remove label="Refresh simple-bar when focused application changes" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar when a window is minimized" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar when a window is resized" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar when an application window is closed" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar on space change" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar on display focus change" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar when current window title changes" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar on space removal" >/dev/null 2>&1 || true
    $(which yabai) -m signal --remove label="Refresh simple-bar on space creation" >/dev/null 2>&1 || true
fi

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
  # removes invisible U+200E Left-To-Right Mark character
  sed "s/\xe2\x80\x8e//g" | \
  # removes newlines from output (handling Google Chrome JSON parse error caused by "search in page")
  tr -d '\n'
