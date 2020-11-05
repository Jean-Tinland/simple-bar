PROCESS=$(/usr/local/bin/yabai -m query --windows --space | sed 's/inf/0/g')

if [ -z "$PROCESS" ]; then
  PROCESS="[]"
fi

echo $(cat <<-EOF
  {
    "process": $PROCESS
  }
EOF
)
