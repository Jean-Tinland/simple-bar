export const BaseStyles = /* css */ `
.simple-bar {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  padding: 4px 5px;
  box-sizing: border-box;
  color: white;
  font-size: 11px;
  font-family: var(--default-font);
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
.simple-bar--process {
  left: 0;
  width: 100%;
  height: 28px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  z-index: 0;
}
.simple-bar--floating.simple-bar--process {
  left: 5px;
  width: calc(100% - 10px);
  border-radius: 3px;
}
.simple-bar--no-bar-background.simple-bar--process {
  background-color: transparent;
  box-shadow: none;
}
.simple-bar--spaces {
  left: 0;
  z-index: 1;
}
.simple-bar--floating.simple-bar--spaces {
  left: 5px;
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
  padding: 4px 5px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: 3px;
}
.simple-bar--no-color-in-data.simple-bar--data {
  color: #fff;
}
.simple-bar--empty {
  height: 28px;
  display: flex;
  align-items: center;
}
.simple-bar--spaces.simple-bar--empty,
.simple-bar--data.simple-bar--empty {
  z-index: 2;
}
.simple-bar--process.simple-bar--empty {
  width: 100%;
  justify-content: center;
}
.simple-bar--data.simple-bar--empty {
  justify-content: flex-end;
  color: white;
}
.simple-bar--empty > span {
  position: relative;
  display: flex;
  align-items: center;
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
.simple-bar--data > *:not(:last-child) {
  margin-right: 5px;
}
`
