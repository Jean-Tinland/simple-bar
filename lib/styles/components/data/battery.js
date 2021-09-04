export const batteryStyles = /* css */ `
.battery {
  position: relative;
  background-color: var(--magenta);
  overflow: hidden;
}
.battery--caffeinate,
.simple-bar--no-color-in-data .battery--caffeinate {
  color: var(--black);
  background-color: var(--white);
}
.simple-bar--background-color-as-foreground .battery {
  color: var(--magenta);
  background-color: transparent;
}
.simple-bar--background-color-as-foreground .battery--caffeinate {
  color: var(--foreground);
}
.battery__icon {
  position: relative;
  width: 16px;
  height: 9px;
  margin-top: -2px;
  margin-right: 10px;
}
.battery__icon::after {
  content: '';
  position: absolute;
  top: calc(10% + 1px);
  left: calc(100% + 2px);
  width: 2px;
  height: 80%;
  border-radius: 0 2px 2px 0;
  background-color: currentColor;
}
.simple-bar--no-color-in-data .battery__icon::after {
  background-color: currentColor;
}
.battery__icon-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid currentColor;
  overflow: hidden;
  z-index: 2;
}
.battery__charging-icon {
  position: absolute;
  top: -1px;
  left: calc(50% - 6px);
  width: 11px;
  height: 11px;
  fill: currentColor;
  stroke: var(--magenta);
  stroke-width: 2;
  z-index: 1;
}
.simple-bar--background-color-as-foreground .battery__charging-icon,
.simple-bar--no-color-in-data .battery__charging-icon {
  stroke: var(--background);
}
.battery--caffeinate .battery__charging-icon {
  stroke: var(--white);
}
.simple-bar--no-color-in-data .battery__icon-inner {
  fill: currentColor;
  border: 1px solid currentColor;
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
  z-index: 0;
}
.simple-bar--no-color-in-data .battery__icon-filler {
  background-color: currentColor;
  opacity: 0.8;
}
.simple-bar--no-color-in-data .battery--caffeinate .battery__icon::after,
.simple-bar--no-color-in-data .battery--caffeinate .battery__icon-filler {
  background-color: currentColor;
}
.battery--low .battery__icon-filler {
  background-color: var(--red);
}
.battery__caffeinate-icon {
  position: absolute;
  top: calc(50% - 15px);
  right: -4px;
  width: 30px !important;
  height: 30px !important;
  box-sizing: border-box;
  fill: var(--main);
  opacity: 0.1;
}
`
