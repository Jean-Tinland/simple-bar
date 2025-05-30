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
.icon-picker__dropdown {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  -webkit-backdrop-filter: blur(5px);
  border-radius: var(--item-radius);
  overflow: hidden;
  z-index: 1;
}
.icon-picker__search {
  position: relative;
  padding: 8px;
  background-color: var(--main-alt);
  border-bottom: 1px solid var(--foreground-alt);
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-picker__back {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  height: 28px;
  background-color: var(--background);
  border: 1px solid var(--foreground-alt);
  border-radius: var(--item-radius);
  color: var(--foreground);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  box-sizing: border-box;
  transition: color 160ms var(--transition-easing),
    background-color 160ms var(--transition-easing),
    box-shadow 160ms var(--transition-easing);
}
.icon-picker__back:hover {
  color: var(--background);
  background-color: var(--foreground);
  box-shadow: var(--hover-ring);
}
.icon-picker__back > svg {
  width: 10px;
  height: 10px;
  margin-right: 6px;
  fill: currentColor;
}
.icon-picker__search-input {
  flex: 1;
  height: 28px;
  padding: 0 35px 0 14px;
  border: 1px solid var(--foreground-alt);
  border-radius: var(--item-radius);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  font-family: var(--font);
  outline: none;
  box-sizing: border-box;
  position: relative;
  transition: border 160ms var(--transition-easing),
    box-shadow 160ms var(--transition-easing);
}
.icon-picker__search-input:focus {
  border-color: var(--foreground);
  box-shadow: var(--focus-ring);
}
.icon-picker__search-input::placeholder {
  color: var(--foreground-alt);
  opacity: 0.7;
}
.icon-picker__search-clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--foreground-alt);
  cursor: pointer;
  font-size: 16px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color 160ms var(--transition-easing),
    background-color 160ms var(--transition-easing);
}
.icon-picker__search-clear:hover {
  color: var(--foreground);
  background-color: var(--main-alt);
}
.icon-picker__icons {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
}
.icon-picker__icons > button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
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
  fill: var(--background);
}
.icon-picker__no-results {
  width: 100%;
  text-align: center;
  color: var(--foreground-alt);
  font-style: italic;
  padding: 20px;
}
`;
