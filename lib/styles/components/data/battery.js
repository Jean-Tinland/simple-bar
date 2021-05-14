export const batteryStyles = /* css */ `
.battery {
  position: relative;
  background-color: var(--magenta);
  overflow: hidden;
}
.battery--caffeinate {
  color: var(--foreground);
  background-color: var(--white);
}
.simple-bar--no-color-in-data .battery--caffeinate {
  background-color: var(--white);
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
  left: 0;
  fill: currentColor;
  z-index: 3;
}
.simple-bar--no-color-in-data .battery__charging-icon-fill {
  fill: currentColor;
}
.battery__charging-icon-outline-left,
.battery__charging-icon-outline-right {
  fill: var(--magenta);
  z-index: 2;
}
.battery--caffeinate .battery__charging-icon-outline-left,
.battery--caffeinate .battery__charging-icon-outline-right {
  fill: var(--white);
}
.simple-bar--no-color-in-data .battery__charging-icon-outline-left,
.simple-bar--no-color-in-data .battery__charging-icon-outline-right {
  fill: var(--background);
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
  border: 1px solid currentColor;
}
.simple-bar--no-color-in-data .battery__icon {
  fill: currentColor;
  border: 1px solid currentColor;
}
.simple-bar--no-color-in-data .battery--caffeinate .battery__icon {
  border: 1px solid var(--foreground);
}
.battery__icon::after {
  content: '';
  position: absolute;
  top: 10%;
  left: 100%;
  width: 3px;
  height: 80%;
  border-radius: 0 2px 2px 0;
  background-color: currentColor;
}
.simple-bar--no-color-in-data .battery__icon::after {
  background-color: currentColor;
}
.battery__icon-filler {
  position: absolute;
  top: 1px;
  left: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-color: currentColor;
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 160ms var(--transition-easing);
  z-index: 1;
}
.simple-bar--no-color-in-data .battery__icon-filler {
  background-color: currentColor;
  opacity: 0.8;
}
.simple-bar--no-color-in-data .battery--caffeinate .battery__icon::after,
.simple-bar--no-color-in-data .battery--caffeinate .battery__icon-filler {
  background-color: var(--foreground);
}
.battery--low .battery__icon-filler {
  background-color: var(--red);
}
.battery__caffeinate-icon {
  position: absolute;
  top: calc(50% - 6px);
  right: 1px;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  fill: var(--main);
  opacity: 0.4;
}
.simple-bar--no-color-in-data .battery__caffeinate-icon {
  fill: var(--white);
}
.simple-bar--no-color-in-data .battery--caffeinate .battery__icon,
.simple-bar--no-color-in-data .battery--caffeinate .battery__charging-icon-fill,
.simple-bar--no-color-in-data .battery--caffeinate .battery__caffeinate-icon {
  fill: var(--foreground);
}
`
