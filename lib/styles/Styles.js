import { Theme } from './Theme.js';

export const BatteryStyles = `
.battery {
  display: flex;
  align-items: center;
}
.battery__icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  fill: white;
}
.battery--low .battery__icon {
  fill: ${Theme.red};
}
`;

export const DateStyles = `
.date {
  color: white;
  text-align: center;
}
`;

export const DividerStyles = `
.divider:nth-of-type(n) {
  margin-left: 5px;
  margin-right: 15px;
}
`;

export const ProcessStyles = `
.process {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}
`;

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

export const TimeStyles = `
.time {
  color: white;
  text-align: center;
}
`;
