# Store the first argument passed to the script in the variable flashspace_path
flashspace_path=$1

# Get the status of System Integrity Protection (SIP) and store it in the variable SIP
SIP=$(csrutil status)

# Retrieve flashspace profiles config and store it in the variable config
# Redirect any error output to /dev/null
config=$(cat ~/.config/flashspace/profiles.json)

# Check if the previous command failed (exit status 1)
if [ $? -eq 1 ]; then
  # Print "flashspaceError" and exit the script with status 0
  echo "flashspaceError"
  exit 0
fi

current_workspace=$($flashspace_path get-workspace)

# Print a JSON object containing the , SIP status, and a shadow property set to true
echo $(cat <<-EOF
  {
    "config": $config,
    "currentWorkspace": "$current_workspace",
    "SIP": "$SIP",
    "shadow": true
  }
EOF
)
