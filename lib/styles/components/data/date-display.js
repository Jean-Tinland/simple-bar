export const DateStyles = /* css */ `
.date {
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
.date:hover {
  opacity: 1;
}
.date:active {
  transform: scale(0.9);
}
.date__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: var(--main);
  transform: translateZ(0);
}
`
