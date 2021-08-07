const baseStyles = /* css */ `
.simple-bar {
  position: fixed;
  top: 0;
  height: var(--bar-height);
  display: flex;
  align-items: stretch;
  padding: var(--bar-inner-margin);
  box-sizing: border-box;
  color: var(--foreground);
  font-size: var(--font-size);
  font-family: var(--font);
}
.simple-bar--floating {
  top: 5px;
}
.simple-bar--no-bar-background {
  padding: 0;
}
.simple-bar--on-bottom {
  top: unset;
  bottom: 0;
}
.simple-bar--floating.simple-bar--on-bottom {
  bottom: 5px;
}
.simple-bar--spaces {
  left: 0;
  width: 100%;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  z-index: 0;
}
.simple-bar--floating.simple-bar--spaces {
  left: 5px;
  width: calc(100% - 10px);
  border-radius: var(--bar-radius);
}
.simple-bar--no-bar-background.simple-bar--spaces,
.simple-bar--no-shadow.simple-bar--spaces {
  box-shadow: none;
}
.simple-bar--no-bar-background.simple-bar--spaces {
  background-color: transparent;
}
.simple-bar--data {
  right: 0;
  margin-left: auto;
  color: var(--main);
  z-index: 1;
}
.simple-bar--floating.simple-bar--data {
  right: 5px;
}
.simple-bar--no-bar-background.simple-bar--data {
  padding: 4px 5px 4px 0;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
}
.simple-bar--no-color-in-data.simple-bar--data {
  color: var(--white);
}
.simple-bar--empty {
  height: var(--bar-height);
  display: flex;
  align-items: center;
}
.simple-bar--spaces.simple-bar--empty,
.simple-bar--data.simple-bar--empty {
  z-index: 2;
}
.simple-bar--data.simple-bar--empty {
  justify-content: flex-end;
  color: white;
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
#simple-bar-click-effect {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  touch-action: none;
  background-color: var(--click-effect);
  z-index: 2147483647;
}
`

export { baseStyles as styles }
