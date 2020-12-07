YABAI_PATH=$1

PROCESS=$($YABAI_PATH -m query --windows --space | sed 's/inf/0/g')

if [ -z "$PROCESS" ]; then
  PROCESS="[]"
fi

echo $(cat <<-EOF
  {
    "process": $PROCESS
  }
EOF
)
