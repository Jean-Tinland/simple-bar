#! /usr/bin/env bash

{
    echo -n 'export const Pywal = '
    cat "$HOME/.cache/wal/colors-speedcrunch.json"
    echo ';'
} > Pywal.js
