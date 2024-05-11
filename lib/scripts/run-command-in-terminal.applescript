on run argv
    set commandToRun to item 1 of argv
    tell application "Terminal"
        do script commandToRun
        activate
    end tell
end run