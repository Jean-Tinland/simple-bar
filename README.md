# simple-bar

A [yabai](https://github.com/koekeishiya/yabai) status bar widget for [Übersicht](https://github.com/felixhageloh/uebersicht) inspired by [nibar](https://github.com/kkga/nibar), [yabar](https://github.com/AlexNaga/yabar) and [this reddit post](https://www.reddit.com/r/unixporn/comments/chwk89/yabai_yabai_and_gruvbox_with_custom_ubersicht_bar/). Visit **simple-bar** website [here](https://www.simple-bar.com/en/).

Developed by [Jean Tinland](https://www.jeantinland.com)

## Features

- 3 themes (dark/light/auto)(\*)
- Multiple layout options (not sticky to top, no background, etc... Try it out in settings)(\*\*)
- Show workspace number & current space (more detailed explanations in dual display support section)
- Navigate to workspace on click
- For each space display an icon for every opened app (you can exclude specific apps in settings)
- Show current app name & title
- Settings module (enable/disable each individual widget: see list below - switch dark/light theme)(\*\*)
- Spotify, Music/iTunes, browser current track
- Battery, microphone, sound level, wifi, date, time widgets
- **Only with SIP disabled**: create new workspace on "+" click, move or destroy workspace on space hover (1s delay / instant with `cmd` key pressed)

(\*) You'll need to manually refresh simple-bar when system theme switch its own theme.\
(\*\*) Settings can be opened by pressing `cmd + ,` after cliking on simple-bar widget.

## Compatibility & requirements

In order to make this custom bar work, you'll need to install both [yabai](https://github.com/koekeishiya/yabai) and [Übersicht](https://github.com/felixhageloh/uebersicht), both of them must be up to date.\
`simple-bar` has been tested and is fully working on both Catalina & Big Sur.
You'll need a screen with a size of 13" at least and with your screen resolution scaled on "More space" setting.\
On the first simple-bar execution, an alert should pop on your screen saying that Übersicht want access your browser control (only the first time you launch your favorite browser with simple-bar opened). It is required to agree to this in order to make the CurrentTrack widget work.

## Preview

![img](./images/preview.jpg)

You'll find more information & images on [simple-bar website](https://www.simple-bar.com/en/).

## Installation

Clone this repo to your Übersicht widgets directory with the following command.

```bash
$ git clone https://github.com/Jean-Tinland/simple-bar $HOME/Library/Application\ Support/Übersicht/widgets/simple-bar
```

I'm using [JetBrains Mono](https://www.jetbrains.com/lp/mono/) as main font and device default monospaced font as fallback.

## Usage

After cloning the project, simply activate all three "simple-bar" widgets in Übersicht's widgets list.

- `simple-bar-process-jsx`
- `simple-bar-spaces-jsx`
- `simple-bar-data-jsx`

## Clickable elements

The spaces and wifi elements in `simple-bar-spaces-jsx` and `simple-bar-data-jsx` are clickable. You can click the wifi element to toggle wifi on/off or on the spaces to go directly to a specific space. Leave you cursor for 1 second over a space in order to show the "move" & "remove" buttons. These buttons and the "Add space" button will only be shown if you have **disabled SIP**

## Refresh bar on app or workspace change

The widget for displaying yabai workspaces and process aren't refreshing automatically or with a delay.\
To refresh them on space or display change, you can add these lines utilizing [yabai's signals](https://github.com/koekeishiya/yabai/wiki/Commands#automation-with-rules-and-signals) at the end of `.yabairc`:

```sh
# Refresh spaces widget on space change
yabai -m signal --add event=space_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'"
# Refresh spaces widget on display focus change
yabai -m signal --add event=display_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'"
# Refresh process widget on space change
yabai -m signal --add event=space_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-process-jsx\"'"

# Refresh process widget on when focused application changes
yabai -m signal --add event=window_focused action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-process-jsx\"'"
# Refresh spaces widget on when focused application changes
yabai -m signal --add event=window_focused action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'"

# Refresh process widget on when focused application changes
yabai -m signal --add event=application_front_switched action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-process-jsx\"'"
# Refresh spaces widget on when focused application changes
yabai -m signal --add event=application_front_switched action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'"

# Refresh process widget on when an application window is closed
yabai -m signal --add event=window_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-process-jsx\"'"
# Refresh spaces widget on when an application window is closed
yabai -m signal --add event=window_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-spaces-jsx\"'"

# Refresh process widget when current window title changes
yabai -m signal --add event=window_title_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"simple-bar-process-jsx\"'"
```

## Customization

### Colors & theme

If you want to customize the colors, shadow & fonts used you can simply edit the `simple-bar > lib > styles > Theme.js` and put your settings in it.

```javascript
export const Theme = {
  main: '#1B222D',
  minor: '#39465E',
  accent: '#FFD484',
  red: '#E78482',
  green: '#8FC8BB',
  yellow: '#FFD484',
  blue: '#6DB3CE',
  magenta: '#AD82CB',
  cyan: '#7EDDDE',
  background: '#1B222D',
  lightGrey: 'rgba(0, 0, 0, 0.05)',
  font: 'JetBrains Mono, monospace',
  lightShadow: '0 5px 10px rgba(0, 0, 0, 0.24)',
  mediumShadow: '0 8px 30px rgba(0, 0, 0, 0.24)',
  largeShadow: '0 30px 60px rgba(0, 0, 0, 0.24)',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
}
```

### Pywal

To use pywal colors instead, run the `pywal-gen.sh` script in `simple-bar > lib > styles`, then edit `simple-bar > lib > styles > Theme.js` to use `ThemePywal.js` instead. This should be done after running `pywal`.

### Icons

Now to add new icons you'll need to get a `.svg` with a `0 0 24 24` viewBox. Then you can simply add it to the `simple-bar > lib > components > Icons.jsx` :

```javascript
export const Caprine = (props) => (
  <Icon {...props}>
    <path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.74 6.62 4.47 8.65V24l4.09-2.24c1.09.3 2.24.46 3.44.46 6.63 0 12-4.97 12-11.1C24 4.97 18.63 0 12 0zm1.2 14.96l-3.06-3.26-5.97 3.26L10.73 8l3.13 3.26L19.76 8l-6.57 6.96z" />
  </Icon>
)
```

To link it to a process you'll need to get the Yabai process name and make the association in `simple-bar > lib > data.js` :

```javascript
import {
  AndroidMessages,
  Caprine,
  Code,
  Default,
  Figma,
  GoogleChrome,
  Music,
  SequelPro,
  Skype,
  Slack,
  Zeplin
} from './components/Icons.jsx'

export const appIcons = {
  'Android Messages': AndroidMessages,
  Caprine: Caprine,
  Code: Code,
  Default: Default,
  Figma: Figma,
  'Google Chrome': GoogleChrome,
  Music: Music,
  'Sequel Pro': SequelPro,
  Skype: Skype,
  Slack: Slack,
  Zeplin: Zeplin
}
```

As you can see if there is no icon defined for a running process, there is a default one which will be used as fallback.

### Override default styles

You'll find a `CustomStyles.js` file in `simple-bar/lib/styles/`. You can simply add your styles here. As it is loaded after all the other styles this will naturally override the default styles.\
You can use the **Übersicht debug console** in order to inspect the widgets composing simple-bar and **get the class names you need to override**.

## Special thanks

- Pywal integration was added thanks to [Amar Paul](https://github.com/Amar1729).
- Wifi toggle on click also added thanks to [Amar Paul](https://github.com/Amar1729).
- Spotify current track & play/pause toggle on click added thanks to [jamieweavis](https://github.com/jamieweavis)
- Large selection of icons added thanks to [jamieweavis](https://github.com/jamieweavis), [MikoMagni](https://github.com/MikoMagni) and [anujc4](https://github.com/anujc4)
- Microphone mute & unmute added thanks to [izifortune](https://github.com/izifortune)
- A way better multiple display behaviour & handling added thanks to [theshortcut](https://github.com/theshortcut)
