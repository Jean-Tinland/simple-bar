# yabar

A [yabai](https://github.com/koekeishiya/yabai) status bar widget for [Übersicht](https://github.com/felixhageloh/uebersicht).

## Features

- Show active workspace number _(with multi-display support)_
- Battery indicator
- WiFi strength indicator
- Connected WiFi name
- System load
- Date and time

### TODO

- Volume

## Screenshot

![img](./img/screenshot_0.png)

## Installation

Clone this repo to your Übersicht widgets directory with the following command.

```bash
$ git clone git@github.com:AlexNaga/yabar.git $HOME/Library/Application\ Support/Übersicht/widgets/yabar
```

## Dependencies

- [SF Mono Fonts](https://developer.apple.com/fonts/) (optional)

## Usage

There are two different widget styles. Enable one of the following widget in Übersicht.

- `yabar-main-0-jsx`
- `yabar-main-1-jsx`

### Refreshing yabai workspaces widget

The widgets for displaying yabai workspaces aren't refreshing automatically (to preserve battery). To refresh them, you can add these lines utilizing [yabai's signals](https://github.com/koekeishiya/yabai/wiki/Commands#automation-with-rules-and-signals) at the end of `.yabairc`:

```sh
yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"yabar-workspace-jsx\"'"
yabai -m signal --add event=display_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"yabar-workspace-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"yabar-workspace-jsx\"'"
```
