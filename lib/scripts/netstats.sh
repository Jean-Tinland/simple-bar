#!/bin/bash

# Function to get network statistics
getNetstats() {
  # Run netstat command with 1-second interval and redirect output to a temporary file
  netstat -w1 > /tmp/netstats.out & sleep 1.5; kill $!;
}

# Call the getNetstats function and discard its output
netstats=$(getNetstats > /dev/null);

# Read the temporary file and filter lines containing numbers
netstats=$(cat /tmp/netstats.out | grep '[0-9].*');

# Extract download and upload values using awk and format them as JSON
netstats=$(echo $netstats | awk '{print "{ \"download\": "$3", \"upload\": "$6"}"}');

# Output the formatted JSON string
echo $netstats;
