on run argv
    set commandToRun to item 1 of argv
    tell application "iTerm"
        set newWindow to (create window with default profile)
        tell current session of newWindow
            write text commandToRun
        end tell
    end tell
end run