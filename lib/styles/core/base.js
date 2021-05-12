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
.simple-bar--process {
  left: 0;
  width: 100%;
  height: 28px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  z-index: 0;
}
.simple-bar--spaces {
  left: 0;
  z-index: 1;
}
.simple-bar--data {
  right: 0;
  margin-left: auto;
  color: var(--main);
  z-index: 1;
}
.simple-bar--data > *:not(:last-child) {
  margin-right: 5px;
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
`
