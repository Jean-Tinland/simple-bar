// Styles for /lib/components/data/browser-track.jsx
export const browserTrackStyles = /* css */ `
.browser-track {
  position: relative;
  background-color: var(--green);
}
.simple-bar--widgets-background-color-as-foreground .browser-track {
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
.simple-bar--widgets-background-color-as-foreground .browser-track__icons > svg:nth-of-type(2) {
  stroke: var(--background);
}
.simple-bar--no-color-in-data .browser-track__icons > svg:nth-of-type(2) {
  fill: currentColor;
  stroke: var(--minor);
}
`;
