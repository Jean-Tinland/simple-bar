export const MusicStyles = /* css */ `
.music {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: var(--green);
  border-radius: 2px;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  opacity: 0.9;
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
}
.simple-bar--no-color-in-data .music {
  background-color: var(--minor);
}
.music:hover {
  opacity: 1;
}
.music:active {
  transform: scale(0.9);
}
.music__icon {
  width: 10px;
  height: 10px;
  margin-right: 7px;
  fill: var(--main);
}
.simple-bar--no-color-in-data .music__icon {
  fill: #fff;
}
.music__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.music__slider {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
