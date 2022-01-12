#! /usr/bin/env bash

{
  echo -n 'export const variables = '
  cat "$HOME/.cache/wal/colors-speedcrunch.json"
  echo ';'
} > pywal.js
