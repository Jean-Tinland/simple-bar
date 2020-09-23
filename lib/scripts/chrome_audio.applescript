set titleString to ""
set activeTab to 0

set appName to "Google Chrome"

if application "Google Chrome" is running then
	tell application "Google Chrome"
		set windowList to every window

		repeat with the_window in windowList
			set tabList to every tab in the_window

			repeat with theTab in tabList
				set theTitle to the title of theTab
				if "- YouTube" is in theTitle then
          if activeTab is 0 then set titleString to " " & text 1 thru -11 of theTitle
					set activeTab to 1
				end if
			end repeat
		end repeat
	end tell
else
end if

return titleString
