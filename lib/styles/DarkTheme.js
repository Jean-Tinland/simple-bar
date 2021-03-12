import { Theme } from './Theme.js'

import { getSettings } from '../settings.js'

const settings = getSettings()
const { toggleWifiOnClick } = settings.networkWidgetOptions
const { font } = settings.global
const simpleBarFont = font !== '' ? font : Theme.font

export const BaseStyles = /* css */ `
.simple-bar {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  padding: 4px 5px;
  box-sizing: border-box;
  color: white;
  font-size: 11px;
  font-family: ${simpleBarFont};
}
.simple-bar--process {
  left: 0;
  width: 100%;
  height: 28px;
  background-color: ${Theme.background};
  box-shadow: ${Theme.lightShadow};
  z-index: 0;
}
.simple-bar--spaces {
  left: 0;
  z-index: 1;
}
.simple-bar--data {
  right: 0;
  margin-left: auto;
  color: ${Theme.main};
  z-index: 1;
}
.simple-bar--data > *:not(:last-child) {
  margin-right: 5px;
}
.simple-bar--empty {
  height: 28px;
  display: flex;
  align-items: center;
}
.simple-bar--spaces.simple-bar--empty,
.simple-bar--data.simple-bar--empty {
  z-index: 2;
}
.simple-bar--process.simple-bar--empty {
  width: 100%;
  justify-content: center;
}
.simple-bar--data.simple-bar--empty {
  justify-content: flex-end;
  color: white;
}
.simple-bar--empty > span {
  position: relative;
  display: flex;
  align-items: center;
}
.simple-bar--empty > span::before {
  content: "";
  width: 6px;
  height: 6px;
  margin-right: 7px;
  background-color: ${Theme.red};
  border-radius: 50%;
}
.simple-bar--empty.simple-bar--loading > span::before {
  background-color: ${Theme.green};
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
  background-color: ${Theme.background};
  box-shadow: ${Theme.lightShadow};
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
  background-color: ${Theme.minor};
}
.weather--sunrise .weather__gradient,
.weather--sunset .weather__gradient {
  display: none;
}
.battery--caffeinate {
  color: ${Theme.main};
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
  fill: ${Theme.minor};
}
.battery__charging-icon-outline-left,
.battery__charging-icon-outline-right {
  fill: ${Theme.minor};
}

.battery--caffeinate .battery__charging-icon-outline-left,
.battery--caffeinate .battery__charging-icon-outline-right {
  fill: #fff;
}
.battery__icon {
  border: 1px solid #fff;
}
.battery--caffeinate .battery__icon {
  border: 1px solid ${Theme.main};
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
  background-color: ${Theme.main};
}
.browser-track__icons > svg:nth-of-type(2) {
  stroke: ${Theme.minor};
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

export const SpacesStyles = /* css */ `
.spaces {
  flex: 0 0 auto;
  display: flex;
  list-style: none;
}
.space {
  position: relative;
  transform-origin: left;
  animation: space-appearance 320ms ${Theme.easing};
}
.space--stack {
  font-weight: 700;
}
@keyframes space-appearance {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.space__inner,
.spaces__add {
  display: flex;
  align-items: center;
  margin-right: 5px;
  padding: 2px 5px;
  background-color: ${Theme.minor};
  border-radius: 2px;
  border: 1px solid transparent;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: color 160ms ${Theme.easing}, background-color 160ms ${Theme.easing}, border 160ms ${Theme.easing}, box-shadow 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
  z-index: 0;
}
.space:hover .space__inner {
  z-index: 1;
}
.spaces__add {
  margin-right: 0;
  background-color: transparent;
  box-shadow: none;
}
.spaces__add:hover {
  background-color: ${Theme.minor};
  box-shadow: ${Theme.lightShadow};
}
.space__inner:active,
.spaces__add:active {
  transform: translateZ(0) scale(0.85);
}
.space--fullscreen .space__inner {
  color: ${Theme.minor};
  background-color: ${Theme.yellow};
}
.space--focused .space__inner {
  color: ${Theme.minor};
  background-color: white;
}
.space--visible .space__inner {
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.space__icon {
  flex: 0 0 11px;
  width: 11px;
  height: 11px;
  margin-left: 6px;
  fill: currentColor;
  opacity: 0.5;
  transform: translateZ(0);
}
.space__icon--focused {
  opacity: 1;
}
.space__icon--fullscreen {
  fill: ${Theme.yellow};
}
.space--focused .space__icon--fullscreen {
  stroke: rgba(0, 0, 0, 0.3);
  stroke-width: 2px;
}
.space-options {
  position: absolute;
  top: calc(100% + 3px);
  left: -2px;
  height: 90%;
  width: 50px;
  height: 18px;
  display: flex;
  align-items: stretch;
  background-color: #fff;
  opacity: 0;
  pointer-events: none;
  touch-action: none;
  border-radius: 3px;
  box-shadow: ${Theme.lightShadow};
  transform-origin: top center;
  transform: translateZ(0) scale(0);
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
  z-index: 1;
}
.space--hovered .space-options {
  opacity: 1;
  transform: translateZ(0);
  pointer-events: auto;
  touch-action: auto;
  transition: opacity 160ms 1s ${Theme.easing}, transform 160ms 1s ${Theme.easing};
}
.space--hovered.space--no-delay .space-options {
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.space-options::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 2;
}
.space-options::after {
  content: '';
  position: absolute;
  top: -3px;
  left: 8px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 3px solid #fff;
}
.space-options__option {
  position: relative;
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: background-color 160ms ${Theme.easing}, opacity 160ms ${Theme.easing};
}
.space-options__option:last-child {
  opacity: 0.8;
  background-color: ${Theme.red};
}
.space--fullscreen .space-options__option:last-child,
.space:first-of-type:only-of-type .space-options__option:last-child,
.space:first-of-type:nth-last-of-type(2) .space-options__option:last-child {
  pointer-events: none;
  touch-action: none;
  opacity: 0.5;
  filter: grayscale(100%);
}
.space:first-of-type .space-options__option--move-prev,
.space:nth-last-of-type(2) .space-options__option--move-next,
.space:first-of-type:only-of-type .space-options__option--move-prev,
.space:first-of-type:only-of-type .space-options__option--move-next,
.space:first-of-type:nth-last-of-type(2) .space-options__option--move-prev,
.space:first-of-type:nth-last-of-type(2) .space-options__option--move-next {
  opacity: 0.2;
  pointer-events: none;
  touch-action: none;
}
.space .space-options__option:first-of-type {
  border-radius: 3px 0 0 3px;
}
.space-options__option:last-of-type {
  border-radius: 0 3px 3px 0;
}
.space-options__option:not(:last-child):hover {
  background-color: ${Theme.lightGrey};
}
.space-options__option:last-child:hover {
  opacity: 1;
}
.space-options__option > svg {
  width: 8px;
  height: 8px;
  fill: ${Theme.main};
  curor: pointer;
  user-select: none;
}
.space-options__option:last-child > svg {
  fill: #fff;
}
.spaces__add > svg {
  width: 10px;
  height: 10px;
  fill: #fff;
}
`

export const ProcessStyles = /* css */ `
.process {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 60px;
  min-height: 12px;
  max-width: 20%;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border-radius: 4px;
}
`

export const SettingsStyles = /* css */ `
.settings {
  z-index: 0;
}
.settings--visible .settings__overlay {
  position: fixed;
  top: 28px;
  left: 0;
  width: 100%;
  height: calc(100% - 28px);
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  z-index: 0;
}
.settings__outer {
  position: fixed;
  left: calc(50% - 250px);
  top: 38px;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  background-color: ${Theme.main};
  border-radius: 4px;
  box-shadow: ${Theme.lightShadow};
  opacity: 0;
  transform: translate(0, -50px) scale(0.8);
  pointer-events: none;
  touch-action: none;
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
  z-index: 1;
}
.settings--visible .settings__outer {
  pointer-events: auto;
  touch-action: auto;
  opacity: 1;
  transform: none;
}
.settings__header {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
}
.settings__close {
  width: 10px;
  height: 10px;
  margin-left: auto;
  cursor: pointer;
  user-select: none;
  fill: white;
}
.settings__tabs {
  display: flex;
  flex-wrap: wrap;
  margin-bottom 20px;
}
.settings__tab {
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  transition: color 160ms ${Theme.easing}, background-color 160ms ${Theme.easing};
}
.settings__tab:not(:last-of-type) {
  margin-right: 10px;
}
.settings__tab:not(.settings__tab--current):hover {
  background-color: ${Theme.minor};
}
.settings__tab--current {
  color: ${Theme.main};
  background-color: #fff;
}
.settings__inner {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow: hidden;
}
.settings__category {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  transition: transform 160ms ${Theme.easing};
}
.settings__inner-title {
  flex: 0 0 100%;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
}
.settings__item-title {
  flex: 0 0 100%;
  margin: 8px 0;
  font-weight: 700;
}
.settings__item,
.settings__item-option {
  flex: 0 0 33.33%;
  margin-bottom: 5px;
}
.settings__item--full-width {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
}
.settings__item--radio {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
}
.settings__item > label,
.settings__item-option > label {
  margin-left: 8px;
}
.settings__item--text > label {
  margin-left: 0;
  margin-right: 8px;
}
.settings__item--full-width.settings__item--text > label {
  flex: 1 1 auto;
  white-space: nowrap;
}
.settings__item--text > input {
  width: auto;
  padding: 1px 4px;
  font-size: 10px;
  box-sizing: border-box;
  border: 0;
  border-radius: 4px;
}
.settings__item--full-width.settings__item--text > input {
  flex: 1 1 100%;
}
.settings__item--text > input:focus {
  outline: none;
}
.settings__infos {
  width: 100%;
  margin-top: 5px;
  padding: 10px;
  background-color: ${Theme.minor};
  border-radius: 5px;
}
.settings__infos-title {
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 700;
}
.settings__info {
  font-style: italic;
}
`

export const WeatherStyles = /* css */ `
.weather {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 7px;
  color: #fff;
  text-decoration: none;
  background-color: ${Theme.minor};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  opacity: 0.9;
  z-index: 0;
  transition: background-color 160ms ${Theme.easing}, opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.weather:hover {
  opacity: 1;
}
.weather:active {
  transform: scale(0.9);
}
.weather__gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  opacity: 0.65;
  z-index: -1;
}
.weather--sunrise .weather__gradient {
  background: linear-gradient(to top right, ${Theme.main}, ${Theme.red}, ${Theme.yellow}, ${Theme.blue});
}
.weather--sunset .weather__gradient {
  background: linear-gradient(to bottom right, ${Theme.blue}, ${Theme.yellow}, ${Theme.red}, ${Theme.magenta}, ${Theme.main});
}
.weather__icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  fill: currentColor;
  transform: translateZ(0);
}
.weather--sunrise .weather__icon {
  color: #fff;
}
`

export const BatteryStyles = /* css */ `
.battery {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 7px;
  background-color: ${Theme.magenta};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  opacity: 0.9;
  transition: background-color 160ms ${Theme.easing}, opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.battery--caffeinate {
  background-color: #fff;
}
.battery:hover {
  opacity: 1;
}
.battery:active {
  transform: scale(0.9);
}
.battery__charging-icon {
  position: relative;
  width: 10px;
  height: 10px;
  margin: 0 auto;
}
.battery__charging-icon-fill,
.battery__charging-icon-outline-left,
.battery__charging-icon-outline-right {
  position: absolute;
  width: inherit;
  height: inherit;
}
.battery__charging-icon-fill {
  fill: ${Theme.main};
  z-index: 3;
}
.battery__charging-icon-outline-left,
.battery__charging-icon-outline-right {
  fill: ${Theme.magenta};
  z-index: 2;
}
.battery--caffeinate .battery__charging-icon-outline-left,
.battery--caffeinate .battery__charging-icon-outline-right {
  fill: #fff;
}
.battery__charging-icon-outline-left {
  left: -1px;
}
.battery__charging-icon-outline-right {
  left: 1px;
}
.battery__icon {
  position: relative;
  width: 16px;
  height: 9px;
  margin-right: 8px;
  border-radius: 2px;
  border: 1px solid ${Theme.main};
}
.battery__icon::after {
  content: '';
  position: absolute;
  top: 10%;
  left: 100%;
  width: 3px;
  height: 80%;
  border-radius: 0 2px 2px 0;
  background-color: ${Theme.main};
}
.battery__icon-filler {
  position: absolute;
  top: 1px;
  left: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-color: ${Theme.minor};
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 160ms ${Theme.easing};
  z-index: 1;
}
.battery--low .battery__icon-filler {
  background-color: ${Theme.red};
}
.battery__caffeinate-icon {
  position: absolute;
  top: calc(50% - 10px);
  right: 1px;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  fill: ${Theme.main};
  opacity: 0.3;
}
`

export const MicStyles = /* css */ `
  .mic {
    background-color: ${Theme.orange};
    display: flex;
    align-items: center;
    padding: 3px 7px;
    border-radius: 2px;
    box-shadow: ${Theme.lightShadow};
    cursor: pointer;
    user-select: none;
    opacity: 0.9;
    transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
  }
  .mic:hover {
    opacity: 1;
  }
  .mic:active {
    transform: scale(0.9);
  }
  .mic__icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    fill: ${Theme.main};
    transform: translateZ(0);
  }
`

export const SoundStyles = /* css */ `
  .sound {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.blue};
    border-radius: 2px;
    box-shadow: ${Theme.lightShadow};
  }
  .sound__icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    fill: ${Theme.main};
  }
`

export const WifiStyles = /* css */ `
  .wifi {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.red};
    border-radius: 2px;
    box-shadow: ${Theme.lightShadow};
    user-select: none;
    opacity: 0.9;
    transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
    ${toggleWifiOnClick ? 'cursor: pointer;' : ''}
  }
  .wifi:hover {
    ${toggleWifiOnClick ? 'opacity: 1;' : ''}
  }
  .wifi:active {
    ${toggleWifiOnClick ? 'transform: scale(0.9);' : ''}
  }
  .wifi__icon {
    width: 14px;
    height: 14px;
    margin-right: 7px;
    fill: ${Theme.main};
    transform: translateZ(0);
  }
`

export const KeyboardStyles = /* css */ `
.keyboard {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.mainAlt};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
}
.keyboard__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
}
`

export const DateStyles = /* css */ `
.date {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.cyan};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.date:hover {
  opacity: 1;
}
.date:active {
  transform: scale(0.9);
}
.date__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
  transform: translateZ(0);
}
`

export const ZoomStyles = /* css */ `
.zoom {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.minor};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
}
.zoom__icon {
  width: 14px;
  height: 14px;
  fill: ${Theme.main};
  margin: 0 1px 0 4px;
}
.zoom__icon--on {
  fill: ${Theme.red};
}
`

export const TimeStyles = /* css */ `
.time {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.yellow};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
}
.time__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
}
.time__filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: inherit;
  transform-origin: left;
  pointer-events: none;
  touch-action: none;
}
`

export const SpotifyStyles = /* css */ `
.spotify {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.green};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  opacity: 0.9;
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.spotify:hover {
  opacity: 1;
}
.spotify:active {
  transform: scale(0.9);
}
.spotify__icon {
  width: 10px;
  height: 10px;
  margin-right: 7px;
  fill: ${Theme.main};
}
.spotify__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.spotify__slider {
  white-space: nowrap;
  transition: transform 160ms ${Theme.easing};
}
`

export const MusicStyles = /* css */ `
.music {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.green};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  opacity: 0.9;
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.music:hover {
  opacity: 1;
}
.music:active {
  transform: scale(0.9);
}
.music__icon {
  width: 10px;
  height: 10px;
  margin-right: 7px;
  fill: ${Theme.main};
}
.music__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.music__slider {
  white-space: nowrap;
  transition: transform 160ms ${Theme.easing};
}
`

export const BrowserTrackStyles = /* css */ `
.browser-track {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.green};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.browser-track__icons {
  position: relative;
}
.browser-track__icons > svg:nth-of-type(1) {
  width: 10px;
  height: 10px;
  margin-right: 7px;
  fill: ${Theme.main};
}
.browser-track__icons > svg:nth-of-type(2) {
  position: absolute;
  bottom: -1px;
  right: 2px;
  width: 10px;
  height: 10px;
  stroke: ${Theme.green};
  stroke-width: 3px;
}
.browser-track__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.browser-track__slider {
  white-space: nowrap;
  transition: transform 160ms ${Theme.easing};
}
`

export const SpecterStyles = /* css */ `
.specter {
  position: absolute;
  bottom: 0;
  right: 30px;
  display: flex;
  align-items: flex-end;
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.specter > span {
  flex: 0 0 5px;
  height: 15px;
  max-height: 4px;
  margin-left: 1px;
  background-color: ${Theme.main};
  opacity: 0.1;
  transition: max-height 160ms ${Theme.easing};
}
.specter > span:nth-of-type(1) {
  animation: specter-waving 640ms -460ms ${Theme.easing} infinite;
}
.specter > span:nth-of-type(2) {
  animation: specter-waving 640ms -320ms ${Theme.easing} infinite;
}
.specter > span:nth-of-type(3) {
  animation: specter-waving 640ms -200ms ${Theme.easing} infinite;
}
.specter > span:nth-of-type(4) {
  animation: specter-waving 640ms -240ms ${Theme.easing} infinite;
}
.specter > span:nth-of-type(5) {
  animation: specter-waving 640ms -150ms ${Theme.easing} infinite;
}
@keyframes specter-waving {
  0%,
  100% {
    max-height: 4px;
  }
  50% {
    max-height: 15px;
  }
}
`

export const VPNStyles = /* css */ `
  .vpn {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.red};
    border-radius: 2px;
    box-shadow: ${Theme.lightShadow};
    cursor: pointer;
    transition: background-color 160ms ${Theme.easing}, opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
  }
  .vpn--disconnected {
    background-color: ${Theme.minor};
  }
  .vpn:active {
    background-color: ${Theme.minor};
    transform: scale(0.9);
  }
  .vpn--disconnected:active {
    background-color: ${Theme.red};
  }
  .vpn__icon {
    width: 14px;
    height: 14px;
    margin-right: 7px;
    fill: ${Theme.main};
  }
`
