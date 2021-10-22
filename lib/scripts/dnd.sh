#!/usr/bin/env bash

# By @joeyhoer > https://github.com/joeyhoer/dnd

# Set global variables
PROGNAME=$(basename "$0")
VERSION='2.0.1'
DND_PLIST_ID='com.apple.ncprefs'
DND_PLIST_KEY='dnd_prefs'
DND_PLIST="$HOME/Library/Preferences/${DND_PLIST_ID}.plist"
PROCESS_LIST=(usernoted)

get_nested_plist(){
  plutil -extract $2 xml1 -o - $1 | \
    xmllint --xpath "string(//data)" - | base64 --decode | plutil -convert xml1 - -o -
}

restart_services(){
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == "" ]]; then continue; fi
    i="$line"
    if [[ $(ps aux | grep $i | awk '$0!~/grep/{print $2}') != "" ]]; then
      killall "$i" && \
      sleep 0.1
    fi
  done <<< "$(printf "%s\n" "$@")"
}

# Reason 1 "Always On"
# Reason 2 "For 1 Hour"
# Reason 3 "Until This Evening"
# Reason 4 "Until Tomorrow"
get_dnd_status() {
  get_nested_plist $DND_PLIST $DND_PLIST_KEY | \
    xmllint --xpath 'boolean(//key[text()="userPref"]/following-sibling::dict/key[text()="enabled"])' -
}

enable_dnd() {
  # If the userPref key does not exist, insert it, otherwise replace it
  enable_flag="-insert"
  if get_nested_plist $DND_PLIST $DND_PLIST_KEY | \
      plutil -extract userPref xml1 - >/dev/null 2>&1; then
    enable_flag="-replace"
  fi

  DND_HEX_DATA=$(get_nested_plist $DND_PLIST $DND_PLIST_KEY | plutil $enable_flag userPref -xml "
    <dict>
        <key>date</key>
        <date>$(date -u +"%Y-%m-%dT%H:%M:%SZ")</date>
        <key>enabled</key>
        <true/>
        <key>reason</key>
        <integer>1</integer>
    </dict> " - -o - | plutil -convert binary1 - -o - | xxd -p | tr -d '\n')
  defaults write $DND_PLIST_ID $DND_PLIST_KEY -data "$DND_HEX_DATA"
  restart_services ${PROCESS_LIST[@]}
}

disable_dnd() {
  DND_HEX_DATA=$(get_nested_plist $DND_PLIST $DND_PLIST_KEY | \
    plutil -remove userPref - -o - | plutil -convert binary1 - -o - | xxd -p | tr -d '\n')
  defaults write $DND_PLIST_ID $DND_PLIST_KEY -data "$DND_HEX_DATA"
  restart_services ${PROCESS_LIST[@]}
}

print_help() {
cat <<EOF
Usage:    $PROGNAME [options]
Version:  $VERSION
DND: Do Not Disturb
Control macOS notification "Do Not Disturb" settings
Options:
  status     Current Do Not Disturb status
               0: Disabled
               1: Enabled
  on         Enable Do Not Disturb
  off        Disable Do Not Disturb
Example:
  dnd on
EOF
exit $1
}

while getopts "h" opt; do
  case $opt in
    h) print_help 0;;
    *) print_help 1;;
  esac
done

shift $(( OPTIND - 1 ))

opt=${1:-on}

if [[ $opt == "status" ]]; then
  get_dnd_status
elif [[ $opt == "on" ]]; then
  if [[ $(get_dnd_status) == "false" ]]; then enable_dnd; fi
elif [[  $opt == "off" ]]; then
  if [[ $(get_dnd_status) == "true" ]]; then disable_dnd; fi
fi