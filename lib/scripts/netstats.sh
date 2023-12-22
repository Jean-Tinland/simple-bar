#!/bin/bash

function getNetstats {
  netstat -w1 > /tmp/netstats.out & sleep 1.5; kill $!;
}

netstats=$(getNetstats > /dev/null);
netstats=$(cat /tmp/netstats.out | grep '[0-9].*');
netstats=$(echo $netstats | awk '{print "{ \"download\": "$3", \"upload\": "$6"}"}');

echo $netstats;
