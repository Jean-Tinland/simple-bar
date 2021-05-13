export const TimeStyles = /* css */ `
.time {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: var(--yellow);
  border-radius: 2px;
  box-shadow: var(--light-shadow);
}
.simple-bar--no-color-in-data .time {
  background-color: var(--minor);
}
.time__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: var(--main);
}
.simple-bar--no-color-in-data .time__icon {
  fill: #fff;
}
.time__filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: inherit;
  transform-origin: left;
  pointer-events: none;
  touch-action: none;
}
`
