export const aerospaceDisplayManagerStyles = /* css */ `
.aerospace-display-manager {
  flex: 1 1 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
.aerospace-display-manager::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--main-alt);
  border-radius: var(--item-radius);
  opacity: 0.1;
  z-index: -1;
}
.aerospace-display-manager__label > em {
  padding: 2px 3px;
  font-size: calc(var(--font-size) - 2px);
  color: var(--foreground);
  background-color: var(--minor);
  border-radius: 2px;
}
.aerospace-display-manager__displays {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.aerospace-display-manager__display {
  display: flex;
  align-items: center;
  gap: 2px;
}
.aerospace-display-manager__display > input {
  width: 8ch;
  padding: 2px 4px;
  box-sizing: border-box;
  font-family: var(--font);
  font-size: calc(var(--font-size) * 0.9);
  background-color: var(--white);
  border: 0;
  outline: none;
  border-radius: 4px;
  transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.aerospace-display-manager__display > input:hover {
  box-shadow: var(--hover-ring);
}
.aerospace-display-manager__display > input:focus {
  box-shadow: var(--focus-ring);
}
.aerospace-display-manager__remove-display {
  padding: 3px 6px;
  box-sizing: border-box;
  background-color: var(--red);
  border-radius: var(--item-radius);
  border: 0;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.aerospace-display-manager__remove-display:hover {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.aerospace-display-manager__remove-display > svg {
  width: 8px;
  height: 8px;
  fill: var(--white);
}
.aerospace-display-manager__add {
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 7px 10px;
  font-family: var(--font);
  font-size: calc(var(--font-size) * 0.9);
  background-color: var(--green);
  border-radius: var(--item-radius);
  border: 0;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.aerospace-display-manager__add:hover {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.aerospace-display-manager__add > svg {
  width: 10px;
  height: 10px;
  margin-right: 1ch;
}
`;
