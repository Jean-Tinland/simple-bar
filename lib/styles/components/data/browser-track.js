export const browserTrackStyles = /* css */ `
.browser-track {
  position: relative;
  background-color: var(--green);
}
.simple-bar--background-color-as-foreground .browser-track {
  color: var(--green);
  background-color: transparent;
}
.browser-track__icons {
  position: relative;
}
.browser-track__icons > svg:nth-of-type(1),
.browser-track__icons > svg:nth-of-type(2) {
  width: 10px;
  height: 10px;
  fill: currentColor;
}
.browser-track__icons > svg:nth-of-type(1) {
  margin-right: 7px;
}
.simple-bar--no-color-in-data .browser-track__icons > svg:nth-of-type(1) {
  fill: currentColor;
}
.browser-track__icons > svg:nth-of-type(2) {
  position: absolute;
  bottom: -1px;
  right: 2px;
  stroke: var(--green);
  stroke-width: 3px;
}
.simple-bar--background-color-as-foreground .browser-track__icons > svg:nth-of-type(2) {
  stroke: var(--background);
}
.simple-bar--no-color-in-data .browser-track__icons > svg:nth-of-type(2) {
  fill: currentColor;
  stroke: var(--minor);
}
.browser-track__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.browser-track__slider {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
