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

tell application "Firefox"
  set the_title to (name of windows whose name contains "- YouTube") as text
  
  if "- YouTube" is in the_title then
    if active_tab is 0 then set title_string to " " & text 1 thru -11 of the_title
    set browser to "firefox"
    set active_tab to 1
  end if
end tell

return "{ \"browser\": \"" & browser & "\", \"title\": \"" & replace_chars(title_string, "\"", "Ò") & "\" }"
