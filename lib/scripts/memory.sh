#!/bin/bash

FREE_BLOCKS=$(vm_stat | grep free | awk '{ print $3 }' | sed 's/\.//')
SYSTEM_BLOCKS=$(vm_stat | grep 'Pages wired down' | awk '{ print $4 }' | sed 's/\.//')
CACHED_BLOCKS=$(vm_stat | grep 'Pages inactive' | awk '{ print $3 }' | sed 's/\.//')
SPECULATIVE_BLOCKS=$(vm_stat | grep 'Pages speculative' | awk '{ print $3 }' | sed 's/\.//')
TOTAL_BLOCKS=$(sysctl -n hw.memsize)

FREE=$((($FREE_BLOCKS+SPECULATIVE_BLOCKS)*$(pagesize)))
CACHED=$(($CACHED_BLOCKS*$(pagesize)))
SYSTEM=$(($SYSTEM_BLOCKS*$(pagesize)))
USED=$(($TOTAL_BLOCKS-$FREE))


echo $(cat <<-EOF
  {
    "system": $SYSTEM,
    "cached": $CACHED,
    "used": $USED,
    "total": $TOTAL_BLOCKS
  }
EOF
)