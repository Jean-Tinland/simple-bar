set browser to ""
set titleString to ""
set activeTab to 0

if application "Google Chrome" is running then
  tell application "Google Chrome"
    set windowList to every window

    repeat with the_window in windowList
      set tabList to every tab in the_window

      repeat with theTab in tabList
        set theTitle to the title of theTab
        if "- YouTube" is in theTitle then
          if activeTab is 0 then set titleString to " " & text 1 thru -11 of theTitle
          set browser to "chrome"
          set activeTab to 1
        end if
      end repeat
    end repeat
  end tell
else
end if

if application "Safari" is running then
  tell application "Safari"
    set windowList to every window

    repeat with the_window in windowList
      set tabList to every tab in the_window

      repeat with theTab in tabList
        set theTitle to the name of theTab
        if "- YouTube" is in theTitle then
          if activeTab is 0 then set titleString to " " & text 1 thru -11 of theTitle
          set browser to "safari"
          set activeTab to 1
        end if
      end repeat
    end repeat
  end tell
else
end if

if application "Firefox" is running then
  tell application "Firefox"
    set theTitle to (name of windows whose name contains "- YouTube") as text
    
    if "- YouTube" is in theTitle then
      if activeTab is 0 then set titleString to " " & text 1 thru -11 of theTitle
      set browser to "firefox"
      set activeTab to 1
    end if
  end tell
end if

return "{ \"browser\": \"" & browser & "\", \"title\": \"" & titleString & "\" }"
