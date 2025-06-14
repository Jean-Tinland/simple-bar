// simple-bar' global styles
const baseStyles = /* css */ `
.simple-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
  height: var(--bar-height);
  display: flex;
  align-items: stretch;
  padding: var(--bar-inner-margin);
  box-sizing: border-box;
  color: var(--foreground);
  font-size: var(--font-size);
  font-family: var(--font);
  background-color: var(--background);
  border: var(--bar-border);
  box-shadow: var(--light-shadow);
}
@media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2),
  only screen and (min-resolution: 192dpi),
  only screen and (min-resolution: 2dppx) {
  .simple-bar {
    -webkit-font-smoothing: antialiased;
  }
}
.simple-bar--floating {
  top: var(--bar-outer-margin, 5px);
  left: var(--bar-outer-margin, 5px);
  width: calc(100% - (var(--bar-outer-margin, 5px) * 2));
  border-radius: var(--bar-radius);
}
.simple-bar--no-bar-background {
  padding: 0;
}
.simple-bar--on-bottom {
  top: unset;
  bottom: 0;
}
.simple-bar--floating.simple-bar--on-bottom {
  bottom: var(--bar-outer-margin, 5px);
}
.simple-bar--no-bar-background,
.simple-bar--no-shadow {
  box-shadow: none;
}
.simple-bar--focused,
.simple-bar--no-shadow.simple-bar--focused {
  box-shadow: inset 0 0 0 1px var(--red);
}
.simple-bar--no-bar-background {
  background-color: transparent;
}
.simple-bar--empty {
  height: var(--bar-height);
  display: flex;
  align-items: center;
}
.simple-bar--empty {
  z-index: 2;
}
.simple-bar--empty > span {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--foreground);
}
.simple-bar--empty > span::before {
  content: "";
  width: 6px;
  height: 6px;
  margin-right: 7px;
  background-color: var(--red);
  border-radius: 50%;
}
.simple-bar--empty.simple-bar--loading > span::before {
  background-color: var(--green);
}
.simple-bar__data {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-left: auto;
}
.simple-bar__data:empty {
  display: none;
}
.simple-bar--no-color-in-data .simple-bar__data {
  color: var(--white);
}
.simple-bar--no-bar-background .simple-bar__data {
  padding: 4px 5px 4px 0;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
}
.simple-bar--no-bar-background.simple-bar--no-shadow .simple-bar__data {
  box-shadow: none;
}
.simple-bar-icon-loader {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  margin-right: 7px;
  background-color: currentColor;
  border-radius: 50%;
}
#simple-bar-click-effect {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  touch-action: none;
  background-color: var(--click-effect);
  z-index: 2147483647;
}
`;

export { baseStyles as styles };
