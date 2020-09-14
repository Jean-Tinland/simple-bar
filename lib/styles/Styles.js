import { Theme } from './Theme.js'

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
  padding: 3px 6px;
  background-color: ${Theme.minor};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: color 320ms ${Theme.easing}, background-color 320ms ${Theme.easing}, transform 320ms ${Theme.easing};
  z-index: 0;
}
@media (prefers-color-scheme: light) {
  .space__inner {
    color: ${Theme.minor};
    background-color: white;
  }
  .spaces__add {
    box-shadow: none;
  }
}
.space:hover .space__inner {
  z-index: 1;
}
.spaces__add {
  background-color: transparent;
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
.space--clicked .space__inner {
  color: ${Theme.main};
  background-color: white;
}
@media (prefers-color-scheme: light) {
  .space--focused .space__inner {
    color: white;
    background-color: ${Theme.minor};
  }
  .space--clicked .space__inner {
    color: white;
    background-color: ${Theme.main};
  }
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
.space--fullscreen .space-options__option:last-child {
  pointer-events: none;
  touch-action: none;
  opacity: 0.5;
  filter: grayscale(100%);
}
.space:first-of-type .space-options__option--move-prev,
.space:nth-last-of-type(2) .space-options__option--move-next {
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
@media (prefers-color-scheme: light) {
  .spaces__add > svg {
    fill: ${Theme.minor}
  }
}
`

export const ProcessStyles = /* css */ `
.process {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 20%;
  text-align: center;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
`

export const BatteryStyles = /* css */ `
.battery {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.magenta};
  border-radius: 2px;
  box-shadow: ${Theme.lightShadow};
}
@media (prefers-color-scheme: light) {
  .battery {
    background-color: white;
  }
}
.battery__charging-icon {
  width: 10px;
  height: 10px;
  margin: 2px 2px 0 0;
  fill: ${Theme.main};
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
  transform scaleX(0);
  transform-origin: left center;
  transition: transform 160ms ${Theme.easing};
}
@media (prefers-color-scheme: light) {
  .battery__icon-filler {
    background-color: ${Theme.green};
  }
}
.battery--low .battery__icon-filler {
  background-color: ${Theme.red};
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
  @media (prefers-color-scheme: light) {
    .sound {
      background-color: white;
    }
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
    cursor: pointer;
    user-select: none;
    opacity: 0.9;
    transition: opacity 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
  }
  @media (prefers-color-scheme: light) {
    .wifi {
      background-color: white;
    }
  }
  .wifi:hover {
    opacity: 1;
  }
  .wifi:active {
    transform: scale(0.9);
  }
  .wifi__icon {
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
}
@media (prefers-color-scheme: light) {
  .date {
    background-color: white;
  }
}
.date__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
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
@media (prefers-color-scheme: light) {
  .time {
    background-color: white;
  }
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
@media (prefers-color-scheme: light) {
  .time__filler {
    background-color: rgba(0, 0, 0, 0.09);
  }
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
@media (prefers-color-scheme: light) {
  .spotify {
    background-color: white;
  }
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
.spotify__specter {
  position: absolute;
  bottom: 0;
  right: 30px;
  display: flex;
  align-items: flex-end;
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.spotify__specter > span {
  flex: 0 0 5px;
  height: 15px;
  max-height: 4px;
  margin-left: 1px;
  background-color: ${Theme.main};
  opacity: 0.1;
  transition: max-height 160ms ${Theme.easing};
}
.spotify--playing .spotify__specter > span:nth-of-type(1) {
  animation: specter-bar-waving 640ms -460ms ${Theme.easing} infinite;
}
.spotify--playing .spotify__specter > span:nth-of-type(2) {
  animation: specter-bar-waving 640ms -320ms ${Theme.easing} infinite;
}
.spotify--playing .spotify__specter > span:nth-of-type(3) {
  animation: specter-bar-waving 640ms -200ms ${Theme.easing} infinite;
}
.spotify--playing .spotify__specter > span:nth-of-type(4) {
  animation: specter-bar-waving 640ms -240ms ${Theme.easing} infinite;
}
.spotify--playing .spotify__specter > span:nth-of-type(5) {
  animation: specter-bar-waving 640ms -150ms ${Theme.easing} infinite;
}
@keyframes specter-bar-waving {
  0%,
  100% {
    max-height: 4px;
  }
  50% {
    max-height: 15px;
  }
}
`
