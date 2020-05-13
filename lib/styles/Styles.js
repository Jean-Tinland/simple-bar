import { Theme } from './Theme.js';

export const SpacesDisplayStyles = `
.spaces-display {
  flex: 0 0 auto;
  display: flex;
  list-style: none;
}
.space {
  margin: 0 3px;
  padding: 2px 6px;
  background-color: ${Theme.minor};
  border-radius: 3px;
  transition: background-color 160ms ${Theme.easing}, color 160ms ${Theme.easing}, transform 160ms ${Theme.easing};
}
.space--focused {
  color: ${Theme.main};
  font-weight: 700;
  background-color: ${Theme.accent};
  transform: scale(1.1);
}
`;

export const ProcessStyles = `
.process {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 40%;
  text-align: center;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
`;

export const DateStyles = `
.date {
  text-align: center;
}
`;

export const TimeStyles = `
.time {
  font-weight: 700;
}
`;

export const DividerStyles = `
.divider:nth-of-type(n) {
  margin-left: 2.5px;
  margin-right: 7.5px;
}
`;

export const BatteryStyles = `
.battery {
  display: flex;
  align-items: center;
}
.battery__charging-icon {
  width: 10px;
  height: 10px;
  margin: 2px 2px 0 0;
  fill: white;
}
.battery--low .battery__charging-icon {
  fill: ${Theme.red};
}
.battery__icon {
  position: relative;
  width: 14px;
  height: 8px;
  margin-right: 8px;
  border: 1px solid white;
}
.battery--low .battery__icon {
  border: 1px solid ${Theme.red};
}
.battery__icon:after {
  content: '';
  position: absolute;
  top: 10%;
  left: 100%;
  width: 3px;
  height: 80%;
  background-color: white;
}
.battery--low .battery__icon:after {
  background-color: ${Theme.red};
}
.battery__icon-filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  transform scaleX(0);
  transform-origin: left center;
  transition: transform 160ms ${Theme.easing};
}
.battery--low .battery__icon-filler {
  background-color: ${Theme.red};
}
`;

export const WifiStyles = `
  .wifi {
    display: flex;
    align-items: center;
  }
  .wifi__icon {
    width: 14px;
    height: 14px;
    margin-right: 7px;
    fill: white;
  }
  .wifi--inactive .wifi__icon {
    fill: ${Theme.red}
  }
`;
