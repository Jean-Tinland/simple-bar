export const iconPickerStyles = /* css */ `
.icon-picker {
  margin-right: 1ch;
}
.icon-picker__button {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--foreground);
  background-color: transparent;
  border: 0;
  cursor: pointer;
  user-select: none;
}
.icon-picker__button > svg {
  width: 24px;
  height: 24px;
}
.icon-picker__icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
  -webkit-backdrop-filter: blur(5px);
  border-radius: var(--item-radius);
  overflow: auto;
  z-index: 1;
}
.icon-picker__icons > button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border: 0;
  background-color: var(--main-alt);
  border-radius: var(--item-radius);
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
}
.icon-picker__icons > button > svg {
  width: 24px;
  height: 24px;
  fill: var(--foreground);
}
`
