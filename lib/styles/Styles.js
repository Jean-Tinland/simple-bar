import { Theme } from './Theme.js'

export const SpacesDisplayStyles = /* css */ `
.spaces-display {
  flex: 0 0 auto;
  display: flex;
  list-style: none;
}
.space {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 5px;
  padding: 3px 6px;
  background-color: ${Theme.minor};
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  transition: color 320ms ${Theme.easing}, transform 320ms ${Theme.easing};
  z-index: 0;
}
@media (prefers-color-scheme: light) {
  .space {
    color: ${Theme.minor};
    background-color: white;
    box-shadow: ${Theme.lightShadow};
  }
}
.space--remove,
.space--cancel-remove,
.space--add {
  padding: 3px 5px;
}
.space--cancel-remove {
  background-color: ${Theme.red};
}
.space:active {
  transform: scale(0.85);
}
.space::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 2px;
  background-color: white;
  border-radius: 2px;
  z-index: -1;
  transition: max-width 320ms ${Theme.easing};
}
@media (prefers-color-scheme: light) {
  .space::after {
    background-color: ${Theme.minor};
  }
}
.space--remove::after,
.space--cancel-remove::after,
.space--add::after {
  content: none;
}
.space--focused {
  color: ${Theme.minor};
}
@media (prefers-color-scheme: light) {
  .space--focused {
    color: white;
  }
}
.space--focused::after {
  max-width: calc(100% + 20px);
}
.space__icon {
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
.space--remove > .space__icon,
.space--cancel-remove > .space__icon,
.space--add > .space__icon {
  width: 10px;
  height: 10px;
  margin-left: 0;
  opacity: 1;
}
.space > span {
  margin-left: 6px;
}
`

export const ProcessStyles = /* css */ `
.process {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 25%;
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
}
@media (prefers-color-scheme: light) {
  .battery {
    color: ${Theme.magenta};
    background-color: white;
    box-shadow: ${Theme.lightShadow};
  }
}
.battery__charging-icon {
  width: 10px;
  height: 10px;
  margin: 2px 2px 0 0;
  fill: ${Theme.main};
}
@media (prefers-color-scheme: light) {
  .battery__charging-icon {
    fill: ${Theme.magenta};
  }
}
.battery__icon {
  position: relative;
  width: 14px;
  height: 8px;
  margin-right: 8px;
  border-radius: 1px;
  border: 1px solid ${Theme.main};
}
@media (prefers-color-scheme: light) {
  .battery__icon {
    border: 1px solid ${Theme.magenta};
  }
}
.battery--low .battery__icon {
  animation: blinking-battery 1280ms ${Theme.easing} infinite;
}
@keyframes blinking-battery {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.battery__icon::after {
  content: '';
  position: absolute;
  top: 10%;
  left: 100%;
  width: 3px;
  height: 80%;
  border-radius: 0 1px 1px 0;
  background-color: ${Theme.main};
}
@media (prefers-color-scheme: light) {
  .battery__icon::after {
    background-color: ${Theme.magenta};
  }
}
.battery__icon-filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${Theme.main};
  transform scaleX(0);
  transform-origin: left center;
  transition: transform 160ms ${Theme.easing};
}
@media (prefers-color-scheme: light) {
  .battery__icon-filler {
    background-color: ${Theme.magenta};
  }
}
`

export const SoundStyles = /* css */ `
  .sound {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.blue};
    border-radius: 2px;
  }
  @media (prefers-color-scheme: light) {
    .sound {
      color: ${Theme.blue};
      background-color: white;
      box-shadow: ${Theme.lightShadow};
    }
  }
  .sound__icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    fill: ${Theme.main};
  }
  @media (prefers-color-scheme: light) {
    .sound__icon {
      fill: ${Theme.blue};
    }
  }
`

export const WifiStyles = /* css */ `
  .wifi {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.red};
    border-radius: 2px;
    transition: transform 160ms ${Theme.easing};
  }
  @media (prefers-color-scheme: light) {
    .wifi {
      color: ${Theme.red};
      background-color: white;
      box-shadow: ${Theme.lightShadow};
    }
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
  @media (prefers-color-scheme: light) {
    .wifi__icon {
      fill: ${Theme.red};
    }
  }
`

export const DateStyles = /* css */ `
.date {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.cyan};
  border-radius: 2px;
}
@media (prefers-color-scheme: light) {
  .date {
    color: ${Theme.cyan};
    background-color: white;
    box-shadow: ${Theme.lightShadow};
  }
}
.date__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
}
@media (prefers-color-scheme: light) {
  .date__icon {
    fill: ${Theme.cyan};
  }
}
`

export const TimeStyles = /* css */ `
.time {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: ${Theme.yellow};
  border-radius: 2px;
}
@media (prefers-color-scheme: light) {
  .time {
    color: ${Theme.yellow};
    background-color: white;
    box-shadow: ${Theme.lightShadow};
  }
}
.time__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
}
@media (prefers-color-scheme: light) {
  .time__icon {
    fill: ${Theme.yellow};
  }
}
`
