export const WeatherStyles = /* css */ `
.weather {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 7px;
  color: #fff;
  text-decoration: none;
  background-color: var(--minor);
  border-radius: 2px;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  opacity: 0.9;
  z-index: 0;
  transition: background-color 160ms var(--transition-easing), opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
}
.weather:hover {
  opacity: 1;
}
.weather:active {
  transform: scale(0.9);
}
.weather__gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  opacity: 0.65;
  z-index: -1;
}
.weather--sunrise .weather__gradient {
  background: linear-gradient(to top right, var(--main), var(--red), var(--yellow), var(--blue));
}
.weather--sunset .weather__gradient {
  background: linear-gradient(to bottom right, var(--blue), var(--yellow), var(--red), var(--magenta), var(--main));
}
.simple-bar--no-color-in-data .weather--sunrise .weather__gradient,
.simple-bar--no-color-in-data .weather--sunset .weather__gradient {
  display: none;
}
.weather__icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  fill: currentColor;
  transform: translateZ(0);
}
.weather--sunrise .weather__icon {
  color: #fff;
}
`
