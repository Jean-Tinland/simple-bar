export const weatherStyles = /* css */ `
.weather {
  position: relative;
  color: var(--foreground);
  background-color: var(--minor);
  overflow: hidden;
  z-index: 0;
}
.simple-bar--background-color-as-foreground .weather {
  background-color: transparent;
}
.weather__gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.65;
  z-index: -1;
}
.weather--sunrise .weather__gradient {
  background: linear-gradient(to top right, var(--main), var(--red), var(--yellow), var(--blue));
}
.weather--sunset .weather__gradient {
  background: linear-gradient(to bottom right, var(--blue), var(--yellow), var(--red), var(--magenta), var(--main));
}
.simple-bar--no-color-in-data .weather__gradient {
  display: none;
}
`
