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
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 35px;
  box-sizing: border-box;
  -webkit-backdrop-filter: blur(5px);
  border-radius: var(--item-radius);
  z-index: 1;
}
.color-picker__colors > button,
.color-picker__custom-color-preview {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  box-shadow: var(--light-shadow);
}
.color-picker__custom-color {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.color-picker__custom-color > * {
  pointer-events: auto;
  touch-action: auto;
}
.color-picker__custom-color-preview {
  cursor: default;
}
input.color-picker__custom-color-input {
  width: 48ch;
}
.color-picker__custom-color-submit {
  margin-left: 8px;
  padding: 7px 10px;
  font-family: var(--font);
  font-size: calc(var(--font-size) * 0.9);
  background-color: var(--green);
  border-radius: var(--item-radius);
  border: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.color-picker__custom-color-submit:not(:disabled) {
  box-shadow: var(--light-shadow);
}
.color-picker__custom-color-submit:not(:disabled):hover {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.color-picker__custom-color-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`
