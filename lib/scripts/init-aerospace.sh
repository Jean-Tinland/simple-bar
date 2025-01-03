SIP=$(csrutil status)

displays=$($(which aerospace) list-monitors --json --format "%{monitor-id} %{monitor-appkit-nsscreen-screens-id}" 2> /dev/null)

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