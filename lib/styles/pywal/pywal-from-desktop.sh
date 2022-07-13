#! /usr/bin/env bash

wal -n -s -i $(sqlite3 -readonly ~/Library/Application\ Support/Dock/desktoppicture.db 'SELECT * FROM data ORDER BY rowID DESC LIMIT 1;' | sed -e "s|~|$HOME|g")

{
  echo -n 'export const variables = '
  cat "$HOME/.cache/wal/colors-speedcrunch.json"
  echo ';'
} > pywal.js
