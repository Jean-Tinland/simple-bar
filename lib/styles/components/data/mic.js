export const MicStyles = /* css */ `
.mic {
  background-color: var(--orange);
  display: flex;
  align-items: center;
  padding: 3px 7px;
  border-radius: 2px;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  opacity: 0.9;
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
}
.simple-bar--no-color-in-data .mic {
  background-color: var(--minor);
}
.mic:hover {
  opacity: 1;
}
.mic:active {
  transform: scale(0.9);
}
.mic__icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  fill: var(--main);
  transform: translateZ(0);
}
.simple-bar--no-color-in-data .mic__icon {
  fill: #fff;
}
`
