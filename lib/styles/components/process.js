export const processStyles = /* css */ `
.process {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;
  touch-action: none;
}
.process:empty {
  display: none;
}
.process__container {
  height: var(--bar-height);
  display: flex;
  align-items: stretch;
  margin: 0 auto;
  padding: var(--bar-inner-margin);
  box-sizing: border-box;
  pointer-events: auto;
  touch-action: auto;
}
.simple-bar--no-bar-background .process__container:not(:empty) {
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
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
  -webkit-user-select: none;
  transition: color 160ms var(--transition-easing), background-color 160ms var(--transition-easing), 
    border 160ms var(--transition-easing), box-shadow 160ms var(--transition-easing);
  z-index: 0;
}
.process__window:only-child {
  margin: 0;
}
.process__window--only-current {
  background-color: var(--minor);
}
.process__window:not(.process__window--only-current):hover {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.process__window:not(.process__window--only-current):active {
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
.process__window--only-current .process__icon,
.process__window--focused .process__icon {
  margin-right: 6px;
}
.process__inner {
  max-width: 0;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  transition: max-width 160ms var(--transition-easing);
}
.process__window--focused .process__inner {
  max-width: 240px;
}
.process__window--only-current .process__inner {
  max-width: 400px;
}
.process__name {
  margin-top: 2px;
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
