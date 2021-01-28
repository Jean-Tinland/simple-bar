YABAI_PATH=$1

PROCESS=$($YABAI_PATH -m query --windows --space | sed 's/inf/0/g; s/\\.//g; s/\n//g')
PROCESS=$(echo ${PROCESS} | tr -d '\n')

if [ -z "$PROCESS" ]; then
  PROCESS="[]"
fi

echo $(cat <<-EOF
  {
    "process": $PROCESS
  }
EOF
)
