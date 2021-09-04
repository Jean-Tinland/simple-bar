export const timeStyles = /* css */ `
.time {
  position: relative;
  background-color: var(--yellow);
  overflow: hidden;
  z-index: 0;
}
.simple-bar--background-color-as-foreground .time {
  color: var(--yellow);
  background-color: transparent;
}
.time__filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  background-color: rgba(0, 0, 0, 0.15);
  transform-origin: left;
  pointer-events: none;
  touch-action: none;
  z-index: -1;
}
`
