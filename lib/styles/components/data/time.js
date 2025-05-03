// Styles for /lib/components/data/time.jsx component
export const timeStyles = /* css */ `
.time {
  position: relative;
  font-variant-numeric: tabular-nums;
  background-color: var(--yellow);
  overflow: hidden;
  z-index: 0;
}
.simple-bar--widgets-background-color-as-foreground .time {
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
.simple-bar--widgets-background-color-as-foreground .time__filler {
  background-color: transparent;
}
.time__icon {
  position: relative;
  flex: 0 0 15px;
  width: 15px;
  height: 15px;
  margin-right: 7px;
  border: 1px solid var(--background);
  border-radius: 50%;
}
.simple-bar--widgets-background-color-as-foreground .time__icon {
  border: 1px solid var(--yellow);
}
.simple-bar--no-color-in-data .time__icon {
  border: 1px solid var(--foreground);
}
.time__hours,
.time__minutes {
  position: absolute;
  bottom: 50%;
  width: 1px;
  left: 50%;
  margin-left: -1px;
  background-color: var(--background);
  transform-origin: bottom;
  transition: transform 160ms var(--transition-easing);
  will-change: transform;
}
.simple-bar--widgets-background-color-as-foreground .time__hours, 
.simple-bar--widgets-background-color-as-foreground .time__minutes {
  background-color: var(--yellow);
}
.simple-bar--no-color-in-data .time__hours,
.simple-bar--no-color-in-data .time__minutes {
  background-color: var(--foreground);
}
.time__hours {
  height: 28%;
}
.time__minutes {
  height: 43%;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2),
  only screen and (min-resolution: 192dpi),
  only screen and (min-resolution: 2dppx) {
  .time__icon {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
  }
  .time__hours,
  .time__minutes {
    margin-left: 0;
  }
}
`;
