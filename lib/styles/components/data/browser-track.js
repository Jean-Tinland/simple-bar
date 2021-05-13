export const BrowserTrackStyles = /* css */ `
.browser-track {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: var(--green);
  border-radius: 2px;
  box-shadow: var(--light-shadow);
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
}
.simple-bar--no-color-in-data .browser-track {
  background-color: var(--minor);
}
.browser-track__icons {
  position: relative;
}
.browser-track__icons > svg:nth-of-type(1) {
  width: 10px;
  height: 10px;
  margin-right: 7px;
  fill: var(--main);
}
.simple-bar--no-color-in-data .browser-track__icons > svg:nth-of-type(1) {
  fill: #fff;
}
.browser-track__icons > svg:nth-of-type(2) {
  position: absolute;
  bottom: -1px;
  right: 2px;
  width: 10px;
  height: 10px;
  stroke: var(--green);
  stroke-width: 3px;
}
.simple-bar--no-color-in-data .browser-track__icons > svg:nth-of-type(2) {
  fill: #fff;
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
