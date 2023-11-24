set browser to ""
set title_string to ""
set active_tab to 0

to replace_chars(this_text, search_string, replacement_string)
 set AppleScript's text item delimiters to the search_string
 set the item_list to every text item of this_text
 set AppleScript's text item delimiters to the replacement_string
 set this_text to the item_list as string
 set AppleScript's text item delimiters to ""
 return this_text
end replace_chars

try
  do shell script "osascript -e 'id of application \"Google Chrome\"'"
  if application "Google Chrome" is running then
    tell application "Google Chrome"
      set window_list to every window

      repeat with the_window in window_list
        set tab_list to every tab in the_window

        repeat with the_tab in tab_list
          set the_title to the title of the_tab
          set the_url to the URL of the_tab
          if "- YouTube" is in the_title then
            if active_tab is 0 then set title_string to " " & text 1 thru -11 of the_title
            set browser to "chrome"
            set active_tab to 1
          end if
          if "open.spotify.com" is in the_url then
						if active_tab is 0 then set title_string to " " & text of the_title
						set browser to "chrome"
						set active_tab to 1
						if "Spotify" is in the_title then set title_string to ""
					end if
        end repeat
      end repeat
    end tell
  end if
end try

try
	do shell script "osascript -e 'id of application \"Brave Browser\"'"
	if application "Brave Browser" is running then
		tell application "Brave Browser"
			set window_list to every window
			
			repeat with the_window in window_list
				set tab_list to every tab in the_window
				
				repeat with the_tab in tab_list
					set the_url to the URL of the_tab
					set the_title to the title of the_tab
          if "- YouTube" is in the_title then
            if active_tab is 0 then set title_string to " " & text 1 thru -11 of the_title
            set browser to "brave"
            set active_tab to 1
          end if
					if "open.spotify.com" is in the_url then
						if active_tab is 0 then set title_string to " " & text of the_title
						set browser to "brave"
						set active_tab to 1
						if "Spotify" is in the_title then set title_string to ""
					end if
				end repeat
			end repeat
		end tell
	end if
end try

if application "Safari" is running then
  tell application "Safari"
    set window_list to every window

    repeat with the_window in window_list
      set tab_list to every tab in the_window

      repeat with the_tab in tab_list
        set the_title to the name of the_tab
        if "- YouTube" is in the_title then
          if active_tab is 0 then set title_string to " " & text 1 thru -11 of the_title
          set browser to "safari"
          set active_tab to 1
        end if
      end repeat
    end repeat
  end tell
end if

return "{ \"browser\": \"" & browser & "\", \"title\": \"" & replace_chars(title_string, "\"", "Ò") & "\" }"
