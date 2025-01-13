aerospace_path=$1

SIP=$(csrutil status)

displays=$($aerospace_path list-monitors --json --format "%{monitor-id} %{monitor-name} %{monitor-appkit-nsscreen-screens-id}" 2> /dev/null)

if [ $? -eq 1 ]; then
  echo "aerospaceError"
  exit 0
fi

echo $(cat <<-EOF
  {
    "displays": $displays,
    "SIP": "$SIP",
    "shadow": true
  }
EOF
)