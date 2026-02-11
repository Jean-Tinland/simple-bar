#!/bin/bash

# Optimized: Single netstat call with direct output processing
netstat -w1 2>&1 | awk 'NR==3 {printf "{ \"download\": %s, \"upload\": %s}", $4, $6; exit}'

