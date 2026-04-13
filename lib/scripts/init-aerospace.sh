# Store the first argument passed to the script in the variable aerospace_path
aerospace_path=$1

# Get the status of System Integrity Protection (SIP) and store it in the variable SIP
SIP=$(csrutil status)

# Wait for AeroSpace to be ready (up to 30 seconds)
# On login, Übersicht may start before AeroSpace is fully initialized
max_retries=15
retry_count=0
displays=""

while [ $retry_count -lt $max_retries ]; do
  displays=$($aerospace_path list-monitors --json --format "%{monitor-id} %{monitor-name} %{monitor-appkit-nsscreen-screens-id}" 2> /dev/null)
  if [ $? -eq 0 ] && [ -n "$displays" ]; then
    break
  fi
  retry_count=$((retry_count + 1))
  sleep 2
done

# If AeroSpace is still not ready after retries, report the error
if [ -z "$displays" ]; then
  echo "aerospaceError"
  exit 0
fi

# Print a JSON object containing the displays information, SIP status, and a shadow property set to true
echo $(cat <<-EOF
  {
    "displays": $displays,
    "SIP": "$SIP",
    "shadow": true
  }
EOF
)