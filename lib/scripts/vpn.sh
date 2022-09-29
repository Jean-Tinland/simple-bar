#!/usr/bin/env bash
VPN=$(scutil --nc list | grep Connected | sed -E 's/.*"(.*)".*/\1/')
if [ "$VPN" != "" ];then
    echo "ON"
else echo "OFF"
fi