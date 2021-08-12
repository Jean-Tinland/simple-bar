export const colorPickerStyles = /* css */ `
.color-picker {
  margin-right: 1ch;
}
.color-picker__button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
}
.color-picker__colors {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-backdrop-filter: blur(5px);
  border-radius: var(--item-radius);
  z-index: 1;
}
.color-picker__colors {
  display: flex;
  align-items: center;
  justify-content: center;
}
.color-picker__colors > button {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  box-shadow: var(--light-shadow);
}
`
