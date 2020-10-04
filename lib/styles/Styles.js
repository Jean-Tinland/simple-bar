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
  box-shadow: ${Theme.lightShadow};
  cursor: pointer;
  user-select: none;
  transition: color 320ms ${Theme.easing}, background-color 320ms ${Theme.easing}, transform 320ms ${Theme.easing};
  z-index: 0;
}
.space--remove,
.space--cancel-remove,
.space--add {
  padding: 3px 5px;
}
.space--cancel-remove {
  background-color: ${Theme.red};
}
.space--fullscreen {
  color: ${Theme.minor};
  background-color: ${Theme.yellow};
}
.space:active {
  transform: scale(0.85);
}
.space--focused {
  color: ${Theme.minor};
  background-color: ${Theme.white};
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
  box-shadow: ${Theme.lightShadow};
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
  background-color: ${Theme.green};
  border-radius: 1px;
  transform scaleX(0);
  transform-origin: left center;
  transition: transform 160ms ${Theme.easing};
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
    transition: transform 160ms ${Theme.easing};
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
.date__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: ${Theme.main};
}
`

export const TimeStyles = /* css */ `
.time {
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
`

export const VPNStyles = /* css */ `
  .vpn {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.red};
    border-radius: 2px;
    box-shadow: ${Theme.lightShadow};
    transition: transform 160ms ${Theme.easing};
  }
  .vpn--disconnected {
    display: flex;
    align-items: center;
    padding: 3px 7px;
    background-color: ${Theme.minor};
    border-radius: 2px;
    box-shadow: ${Theme.lightShadow};
    transition: transform 160ms ${Theme.easing};
  }
  .vpn:active {
    background-color: ${Theme.minor};
    transform: scale(0.9);
  }
  .vpn--disconnected:active {
    background-color: ${Theme.red};
    transform: scale(0.9);
  }
  .vpn__icon {
    width: 14px;
    height: 14px;
    margin-right: 7px;
    fill: ${Theme.main};
  }
`
