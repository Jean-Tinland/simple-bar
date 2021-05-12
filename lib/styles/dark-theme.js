import { Theme } from './theme'

import { getSettings } from '../settings'

const settings = getSettings()
const { networkWidgetOptions, global } = settings
const { toggleWifiOnClick } = networkWidgetOptions
const { font } = global

export const Variables = /* css */ `
:root {
  --main: ${Theme.colors.main};
  --mainAlt: ${Theme.colors.mainAlt};
  --minor: ${Theme.colors.minor};
  --accent: ${Theme.colors.yellow};
  --red: ${Theme.colors.red};
  --green: ${Theme.colors.green};
  --yellow: ${Theme.colors.yellow};
  --orange: ${Theme.colors.orange};
  --blue: ${Theme.colors.blue};
  --magenta: ${Theme.colors.magenta};
  --cyan: ${Theme.colors.cyan};
  --foreground: ${Theme.colors.foreground};
  --background: ${Theme.colors.main};
  --light-grey: ${Theme.colors.lightGrey};
  --default-font: ${font !== '' ? font : Theme.defaultFont};
  --light-shadow: ${Theme.lightShadow};
  --transition-easing: ${Theme.easing};
}
`

export const FloatingBarOverride = /* css */ `
.simple-bar {
  top: 5px;
}
.simple-bar--spaces {
  left: 5px;
}
.simple-bar--process {
  left: 5px;
  width: calc(100% - 10px);
  border-radius: 3px;
}
.simple-bar--data {
  right: 5px;
}

.settings--visible .settings__overlay {
  display: none;
}
.settings__outer {
  top: 43px;
}
`

export const NoBarBgOverride = /* css */ `
.simple-bar {
  padding: 0;
}
.simple-bar--process {
  background-color: transparent;
  box-shadow: none;
}
.simple-bar--data,
.spaces,
.process {
  padding: 4px 5px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: 3px;
}
.process {
  height: 20px;
  display: flex;
  align-items: center;
  padding: 4px 10px;
}

.settings--visible .settings__overlay {
  display: none;
}
`

export const NoColorInDataOverride = /* css */ `
.simple-bar--data {
  color: #fff;
}
.spotify,
.zoom,
.music,
.browser-track,
.battery,
.mic,
.sound,
.wifi,
.date,
.time {
  background-color: var(--minor);
}
.weather--sunrise .weather__gradient,
.weather--sunset .weather__gradient {
  display: none;
}
.battery--caffeinate {
  color: var(--main);
  background-color: #fff;
}
.spotify__icon,
.music__icon,
.browser-track__icons > svg:nth-of-type(1),
.browser-track__icons > svg:nth-of-type(2),
.battery__icon,
.zoom__icon,
.zoom__icon--on,
.zoom__icon--off,
.mic__icon,
.sound__icon,
.wifi__icon,
.date__icon,
.time__icon,
.battery__charging-icon-fill,
.battery__caffeinate-icon {
  fill: #fff;
}
.battery--caffeinate .battery__icon,
.battery--caffeinate .battery__charging-icon-fill,
.battery--caffeinate .battery__caffeinate-icon {
  fill: var(--minor);
}
.battery__charging-icon-outline-left,
.battery__charging-icon-outline-right {
  fill: var(--minor);
}

.battery--caffeinate .battery__charging-icon-outline-left,
.battery--caffeinate .battery__charging-icon-outline-right {
  fill: #fff;
}
.battery__icon {
  border: 1px solid #fff;
}
.battery--caffeinate .battery__icon {
  border: 1px solid var(--main);
}
.battery__icon::after {
  background-color: #fff;
}
.battery__icon-filler {
  background-color: #fff;
  opacity: 0.8;
}
.battery--caffeinate .battery__icon::after,
.battery--caffeinate .battery__icon-filler {
  background-color: var(--main);
}
.browser-track__icons > svg:nth-of-type(2) {
  stroke: var(--minor);
}
.specter > span {
  background-color: #fff;
}
`

export const BottomBarOverride = /* css */ `
.simple-bar {
  top: unset;
  bottom: 0;
}

.settings--visible .settings__overlay {
  top: unset;
  bottom: 28px;
}
.settings__outer {
  top: unset;
  bottom: 38px;
  transform: translate(0, 50px) scale(0.8);
}

.space-options {
  top: unset;
  bottom: calc(100% + 3px);
  left: -2px;
  transform-origin: bottom center;
}
.space-options::after {
  content: '';
  top: unset;
  bottom: -3px;
  left: 8px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 3px solid #fff;
  border-bottom: none;
}
`

export const FloatinBottomBarOverride = /* css */ `
.simple-bar {
  top: unset;
  bottom: 5px;
}
`

export const InlineSpacesOptionsOverride = /* css */ `
.space-options {
  width: 60px;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 3px;
  transform-origin: center;
}
.space-options::after {
  content: none;
}
`
