// Styles for /lib/components/data/battery.jsx component
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
.simple-bar--widgets-background-color-as-foreground .battery {
  color: var(--magenta);
  background-color: transparent;
}
.simple-bar--widgets-background-color-as-foreground .battery--caffeinate {
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
  border-radius: 0 3px 3px 0;
  background-color: currentColor;
}
.simple-bar--no-color-in-data .battery__icon::after {
  background-color: currentColor;
}
.battery__icon-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  border: 1px solid currentColor;
  overflow: hidden;
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
}
.simple-bar--no-color-in-data .battery__charging-icon {
  stroke: var(--minor);
}
.battery--caffeinate .battery__charging-icon {
  stroke: var(--white);
}
.simple-bar--widgets-background-color-as-foreground .battery__charging-icon {
  stroke: var(--background);
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
  border-radius: 2px;
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
.battery--low-power-mode .battery__icon-filler {
  background-color: var(--yellow);
}
.battery__caffeinate-icon {
  position: absolute;
  top: calc(50% - 12px);
  right: -4px;
  width: 26px !important;
  height: 26px !important;
  opacity: 0.15;
}
.battery__caffeinate-icon g path {
  animation: coffee-spur-sliding-up 1600ms var(--transition-easing) infinite;
}
.simple-bar--animations-disabled .battery__caffeinate-icon g path {
  animation: none;
}
.battery__caffeinate-icon g path:nth-child(2) {
  animation-delay: -600ms;
}
.battery__caffeinate-icon g path:nth-child(3) {
  animation-delay: -280ms;
}
@keyframes coffee-spur-sliding-up {
  0% {
    opacity: 0;
    transform: translateY(3px);
  }
  20% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: translateY(-4px);
  }
}
`;
