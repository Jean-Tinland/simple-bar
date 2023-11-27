# <img src="./images/logo-simple-bar.png" width="200" alt="simple-bar" />

A [yabai](https://github.com/koekeishiya/yabai) status bar widget for [Übersicht](https://github.com/felixhageloh/uebersicht) inspired by [nibar](https://github.com/kkga/nibar), [yabar](https://github.com/AlexNaga/yabar) and [this reddit post](https://www.reddit.com/r/unixporn/comments/chwk89/yabai_yabai_and_gruvbox_with_custom_ubersicht_bar/). Visit **simple-bar** website [here](https://www.jeantinland.com/en/toolbox/simple-bar).

A more "lite" & less ressource greedy version is available [here](https://github.com/Jean-Tinland/simple-bar-lite).

## Features

- 3 themes behaviours: dark, light or automatic (synced with system)
- Extensible themes system
- Numerous customisation options (not sticky to top, no background, etc... Try it out in settings) (1)
- Toggle theme system wide (2)
- Display workspace number/label & current space
- Navigate to workspace on click
- For each space display an icon for every opened app (you can exclude specific apps/windows in settings based on process name or window title)
- Show all opened apps (and current) in current space or simply current app name & title
- Show all opened (or only focused) apps `stack-index` (from `yabai`) if you use stacking
- Settings module (enable/disable each individual widget: see list below - switch dark/light theme) (1)
- Spotify, Music/iTunes, browser current track (3)
- Battery, microphone, sound level, wifi, date, time widgets
- You can add your own custom widgets in settings (1)
- **Only with SIP disabled**: create new workspace on "+" click, move or destroy workspace on space hover
- Show current mode for `skhd`

(1) Settings can be opened by pressing `cmd + ,` after clicking on **simple-bar** widget. More details in [Settings](#settings) section.\
(2) Toggle dark/light mode by pressing `cmd + t` while focusing **simple-bar** (a red border should be visible at this moment).\
(3) Currently supported: Google Chrome (YouTube & Spotify for browser), Brave (YouTube & Spotify for browser), Safari (YouTube) & Firefox (YouTube).\
(4) You'll be prompted to let Übersicht use you geolocation.

## Compatibility & requirements

In order to make this custom bar work, you'll need to install both [yabai](https://github.com/koekeishiya/yabai) and [Übersicht](https://github.com/felixhageloh/uebersicht), both of them must be up to date. `simple-bar` supports yabai from v3 to v6 (v6 is mandatory on Sonoma).

Be careful, for Big Sur users (and above), some actions must be taken in order to make yabai fully operational: [see here for more details](<https://github.com/koekeishiya/yabai/wiki/Installing-yabai-(latest-release)#macos-big-sur---automatically-load-scripting-addition-on-startup>).

**It is important to note that you'll need to use yabai in `bsp` or `stack` layout mode in order to prevent app windows to overlap simple-bar.**

On the first **simple-bar** execution, an alert should pop on your screen saying that Übersicht want access your browser control (only the first time you launch your favorite browser with **simple-bar** opened). It is required to agree to this in order to make the CurrentTrack widget work.

**_`simple-bar` is optimized for the english language. Icon association is not localized._**

**_`simple-bar` has only been tested on several Intel & Apple Silicon based Macs and is working on Catalina, Big Sur & above... Apple Silicon users will need to read the section <a href="#apple-sillicon-instructions">`For users having the latest ARM64 chipset devices (M1 and M2 variants)`</a>_**

**_Mac book with top notch may be subject to display issues if you use the process widget: you can now uncheck "Center process widget" in the settings module.._**

## Preview

![img](./images/preview.png)

You'll find more information & images on [simple-bar website](https://www.simple-bar.com/en/).

## Installation

Clone this repo to your Übersicht widgets directory with the following command.

```bash
$ git clone https://github.com/Jean-Tinland/simple-bar $HOME/Library/Application\ Support/Übersicht/widgets/simple-bar
```

**Be careful, the folder containing the widget must be named `simple-bar`, otherwise, simple-bar will never launch.**

[JetBrains Mono](https://www.jetbrains.com/lp/mono/) is used by default. You can set your own font in the "Global" settings tab.

<div id="apple-sillicon-instructions"></div>

### For users having the latest ARM64 chipset devices (M1 and M2 variants)

Yabai is installed by default in `/opt/homebrew/bin/yabai` path for arm64 chipset devices. In order to use simple-bar without having any errors, create a symbolic link of yabai's binary using the command provided below for simple-bar to work properly.

```bash
ln -s /opt/homebrew/bin/yabai /usr/local/bin/yabai
```

### For users with a custom yabai install (path)

There is a setting in the settings module allowing a custom yabai path.

## Usage

After cloning the project, simply activate **simple-bar** widget in Übersicht's widgets list: `simple-bar-index-jsx`.

## Settings

As explained at the beginning of this README file, Settings can be opened by pressing `cmd + ,` after clicking on **simple-bar** widget. You may want to click at the top center of the screen, where the process name of the current app is displayed in order to easily get focus on **simple-bar** before pressing `cmd + ,`.

In this settings module you'll find all the customization options available from layout to specific widgets show/hide toggle.

## Clickable elements

Some elements of **simple-bar** are interactive. For example :

- Toggle caffeinate mode on battery widget click (prevent your mac to sleep while activate)
- Toggle wifi on/off on wifi widget click
- Toggle microphone on microphone widget click
- Play/pause Spotify or Music-iTunes current song on Spotify/Music-iTunes widget click
- Open Calendar app on date widget click
- Open weather previsions in browser on weather widget click
- Remove, move spaces on space hover (1s delay / instant while `cmd` key is pressed) (**Only with SIP disabled**)
- Add space on "plus" button click (**Only with SIP disabled**)

Clickable elements have an outline showing up on hover in order to easily identify them.

## Customization

### Colors & theme

If you want to customize the colors, shadows, fonts, etc... you can simply tweak an existing theme or create your own in `simple-bar > lib > styles > themes`.

You can duplicate an existing theme and change the exported function name, the "name" and the "kind" (light or dark) properties.

Once you have created your theme, you can import it in `simple-bar > lib > styles > themes > themes.js` and add it in the already exported themes. Your theme should now appear in the "Themes" settings tab.

Feel free to open an issue if you want me to add a theme or if you created a theme and are willing to share it.

### Pywal

To use pywal colors instead, run the `pywal-gen.sh` script in `simple-bar > lib > styles > pywal`, then edit `simple-bar > lib > styles > theme.js` : `const WITH_PYWAL = false` must be set to "true".\
This should be done after running `pywal`.\
As I am not using this myself, I may have missed some problems, feel free to open an issue about it anytime.

### `skhd` Mode Indicator

Configuring a mode indicator for `skhd` requires defining on `on_enter` command for any modes you want to show. This `on_enter` command calls a script provided by `simple-bar` to cache the name of the mode as well as your preferred color (default color is white).

You can use any color (e.g. the 8 standard shell colors) defined as a variable by simple-bar (see `./lib/styles/core/variables.js`, or the Uebersicht debug console).

```
# ~/.skhdrc

# define a mode named "default". A mode named "default" will NOT be shown by simple-bar.
:: default : ~/.config/ubersicht/widgets/simple-bar/lib/scripts/yabai-set-mode.sh default

# define a mode named "tree" that will be colored blue
:: tree : ~/.config/ubersicht/widgets/simple-bar/lib/scripts/yabai-set-mode.sh tree blue

# define a mode called "binding" (in skhd) that will display in simple-bar as "binds"
:: binding : ~/.config/ubersicht/widgets/simple-bar/lib/scripts/yabai-set-mode.sh binds green
```

The `yabai-set-mode.sh` script uses an AppleScript command to refresh `simple-bar`. That command requires permissions, which you can set in System Preferences > Privacy & Security > Automation > skhd > ubersicht.

The mode indicator should appear within about a second after you enter a mode, in the process widget. You can debug this if it doesn't work by moving your mouse to different windows, or checking the skhd log/err files.

### Icons

Now to add new icons you'll need to get a `.svg` with a `0 0 24 24` viewBox. Then you can simply add it to the `simple-bar > lib > components > Icons.jsx`:

```javascript
export const Caprine = (props) => (
  <Icon {...props}>
    <path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.74 6.62 4.47 8.65V24l4.09-2.24c1.09.3 2.24.46 3.44.46 6.63 0 12-4.97 12-11.1C24 4.97 18.63 0 12 0zm1.2 14.96l-3.06-3.26-5.97 3.26L10.73 8l3.13 3.26L19.76 8l-6.57 6.96z" />
  </Icon>
);
```

To link it to a process you'll need to get the Yabai process name and make the association in `simple-bar > lib > app-icons.js` :

```javascript
import as * Icons from './components/Icons.jsx'

export const appIcons = {
  'Android Messages': Icons.AndroidMessages,
  Caprine: Icons.Caprine,
  Code: Icons.Code,
  Default: Icons.Default,
  Figma: Icons.Figma,
  'Google Chrome': Icons.GoogleChrome,
  Music: Icons.Music,
  'Sequel Pro': Icons.SequelPro,
  Skype: Icons.Skype,
  Slack: Icons.Slack,
  Zeplin: Icons.Zeplin
}
```

If there is no icon defined for a running process, there is a default one which will be used as fallback.

Same as for themes, feel free to post a message in [this issue](https://github.com/Jean-Tinland/simple-bar/issues/189) if you have an icon request.

### Override default styles

As I tried to automate a lot of things, there may be some specific elements that are impossible to change when creating your own theme.

To remedy this problem, there is a tab in settings allowing you to override any **simple-bar** style you want.

You can simply add your styles there. As it is loaded after all the other styles this will naturally override the default styles.\
You can use the **Übersicht debug console** in order to inspect the widgets composing simple-bar and **get the class names you need to override**.

## Special thanks

- Network stats widget with a shell script adapted from [this repo](https://github.com/dionmunk/ubersicht-network-throughput) by [@dionmunk](https://github.com/dionmunk) (under Creative Commons Attribution-NonCommercial 4.0 International License)
- Pywal integration added thanks to [@Amar1729](https://github.com/Amar1729)
- Wifi toggle on click also added thanks to [@Amar1729](https://github.com/Amar1729)
- Stack index indicator also added thanks to [@Amar1729](https://github.com/Amar1729)
- SKHD mode indicator also thanks to [@Amar1729](https://github.com/Amar1729)
- Crypto widget added thanks to [@yorhodes](https://github.com/yorhodes)
- Stocks widget added thanks to [@ZhongXiLu](https://github.com/ZhongXiLu)
- Spotify current track & play/pause toggle on click and Dracula theme adaptation added thanks to [@jamieweavis](https://github.com/jamieweavis)
- Sticky windows workaround & several sticky windows options in settings added thanks to [@kvndrsslr](https://github.com/kvndrsslr)
- Right & middle click actions in Spotify, Wifi & all user widgets added thanks to [@rosenpin](https://github.com/rosenpin)
- Open space options on right click added thanks to [@rosenpin](https://github.com/rosenpin)
- Large selection of icons added thanks to [@jamieweavis](https://github.com/jamieweavis), [@MikoMagni](https://github.com/MikoMagni), [@anujc4](https://github.com/anujc4), [@SijanC147](https://github.com/SijanC147), [@donaldguy](https://github.com/donaldguy), [@d-miketa](https://github.com/d-miketa)
- Microphone mute & unmute added thanks to [@izifortune](https://github.com/izifortune)
- A way better multiple display behaviour & handling added thanks to [@theshortcut](https://github.com/theshortcut)
- Native space switching added thanks to [@jming422](https://github.com/jming422)
- A better spotify process detection added thanks to [@s00500](https://github.com/s00500)
- Gruvbox Dark theme adaptation added thanks to [@spwx](https://github.com/spwx)
- Gruvbox Light theme adaptation added thanks to [@basbebe](https://github.com/basbebe)
- Gruvbox Material theme adaptation added thanks to [@is0n](https://github.com/is0n)
- Amarena Dark theme implementation thanks to [@MikoMagni](https://github.com/MikoMagni)
- Solarized Light & Dark themes implementation thanks to [@Joroovb](https://github.com/Joroovb)
- Sylens theme implementation thanks to [@Sylenss](https://github.com/Sylenss)
- SpaceDuck theme implementation thanks to [@ZhongXiLu](https://github.com/ZhongXiLu)
- Cisco theme implementation thanks to [@mrzone64](https://github.com/mrzone64)
- Material theme implementation thanks to [@devinbhatt](https://github.com/devinbhatt)
- Night Owl theme implementation thanks to [@mdwitr0](https://github.com/mdwitr0)
- Everyone opening issues that are helping me improve this little project by adding icons, fixing what they can, and every other things...
