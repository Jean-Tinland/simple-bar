#! /usr/bin/env bash

{
  echo -n 'export const pywal = '
  cat "$HOME/.cache/wal/colors-speedcrunch.json"
  echo ';'
} > pywal.js
