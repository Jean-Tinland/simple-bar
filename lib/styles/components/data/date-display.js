export const DateStyles = /* css */ `
.date-display {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  white-space: nowrap;
  background-color: var(--cyan);
  border-radius: 2px;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
}
.simple-bar--no-color-in-data .date-display {
  background-color: var(--minor);
}
.date-display:hover {
  opacity: 1;
}
.date-display:active {
  transform: scale(0.9);
}
.date-display__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: var(--main);
  transform: translateZ(0);
}
.simple-bar--no-color-in-data .date-display__icon {
  fill: #fff;
}
`
