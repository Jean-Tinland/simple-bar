# Store the first argument passed to the script in the variable aerospace_path
aerospace_path=$1

# Get the status of System Integrity Protection (SIP) and store it in the variable SIP
SIP=$(csrutil status)

# List monitors using the aerospace tool, format the output as JSON, and store it in the variable displays
# Redirect any error output to /dev/null
displays=$($aerospace_path list-monitors --json --format "%{monitor-id} %{monitor-name} %{monitor-appkit-nsscreen-screens-id}" 2> /dev/null)

# Check if the previous command failed (exit status 1)
if [ $? -eq 1 ]; then
  # Print "aerospaceError" and exit the script with status 0
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