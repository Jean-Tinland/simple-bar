tell application "System Events" Â
  to tell process "FlashSpace" Â
    to set workspace to (title of menu bar items of menu bar 2)
return workspace
