export const processStyles = /* css */ `
.process:not(.process--all-windows) {
  min-width: 60px;
  min-height: 12px;
  max-width: 20%;
  display: block;
  margin: 0 auto;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-radius: 4px;
}
.process:empty {
  display: none;
}
.simple-bar--no-bar-background .process:not(:empty) {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
}
.process--all-windows {
  height: var(--bar-height);
  display: flex;
  align-items: stretch;
  margin: 0 auto;
  padding: var(--bar-inner-margin);
  box-sizing: border-box;
}
.process__window {
  display: flex;
  align-items: center;
  margin: var(--item-outer-margin);
  padding: var(--item-inner-margin);
  color: currentColor;
  font-family: var(--font);
  background-color: var(--minor);
  border-radius: var(--item-radius);
  border: 0;
  outline: none;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  transition: color 160ms var(--transition-easing), background-color 160ms var(--transition-easing), 
    border 160ms var(--transition-easing), box-shadow 160ms var(--transition-easing);
  z-index: 0;
}
.process__window:hover {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.process__window:active {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.process__window--focused {
  color: var(--minor);
  background-color: var(--foreground);
}
.process__icon {
  flex: 0 0 11px;
  width: 11px;
  height: 11px;
  fill: currentColor;
  transition: margin-right 160ms var(--transition-easing);
}
.process__window--focused .process__icon {
  margin-right: 6px;
}
.process__inner {
  max-width: 0;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
  transition: max-width 160ms var(--transition-easing);
}
.process__window--focused .process__inner {
  max-width: 240px;
}
.process__name {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
