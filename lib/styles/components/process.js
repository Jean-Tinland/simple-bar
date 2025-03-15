// Styles for /lib/components/{yabai|aerospace}/process.jsx components
export const styles = /* css */ `
.process {
  display: flex;
  pointer-events: none;
  touch-action: none;
}
.process--centered {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
}
.process:empty {
  display: none;
}
.process__container {
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  pointer-events: auto;
  touch-action: auto;
}
.process--centered .process__container {
  height: var(--bar-height);
  margin: 0 auto;
  padding: var(--bar-inner-margin);
}
.simple-bar--no-bar-background .process__container:not(:empty) {
  padding: 4px 5px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
}
.process__layout {
  display: flex;
  align-items: center;
  padding: var(--item-inner-margin);
  color: var(--white);
  font-family: var(--font);
  font-size: var(--font-size);
  background-color: var(--main-alt);
  border-radius: var(--item-radius);
  box-shadow: var(--light-shadow);
}
.simple-bar--spaces-background-color-as-foreground .process__layout {
  color: var(--foreground);
  font-weight: 700;
  background-color: transparent;
  box-shadow: none;
}
.process__skhd-mode {
  display: flex;
  align-items: center;
  padding: var(--item-inner-margin);
  color: var(--foreground);
  background-color: var(--minor);
  font-family: var(--font);
  font-size: var(--font-size);
  border-radius: var(--item-radius);
  box-shadow: var(--light-shadow);
  font-style: italic;
  text-transform: uppercase;
}
.process__window {
  display: flex;
  align-items: center;
  gap: 3px;
  margin: var(--item-outer-margin);
  padding: var(--item-inner-margin);
  color: currentColor;
  font-family: var(--font);
  font-size: var(--font-size);
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
.simple-bar--spaces-background-color-as-foreground .process__window {
  background-color: transparent;
  box-shadow: none;
}
.simple-bar--no-shadow .process__container,
.simple-bar--no-bar-background.simple-bar--no-shadow .process__container,
.simple-bar--no-shadow .process__layout,
.simple-bar--no-shadow .process__skhd-mode,
.simple-bar--no-shadow .process__window {
  box-shadow: none;
}
.process__window:only-child {
  margin: 0;
}
.process__window--only-current {
  background-color: var(--minor);
}
.process__window--focused {
  color: var(--minor);
  background-color: var(--foreground);
}
.process__stack-index {
  padding: 2px 5px;
  color: var(--foreground);
  background-color: var(--background);
  font-size: calc(var(--font-size) - 1px);
  border-radius: var(--item-radius);
}
.process__window--focused .process__stack-index {
  color: var(--white);
  background-color: var(--main-alt);
}
.simple-bar--spaces-background-color-as-foreground .process__window--focused {
  color: var(--foreground);
  background-color: transparent;
  box-shadow: var(--light-shadow), 0 0 0 1px var(--foreground);
}
.process__window:not(.process__window--only-current):not(.process__window--focused):is(:hover, :active) {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.process__icon {
  flex: 0 0 11px;
  width: 11px;
  height: 11px;
  fill: currentColor;
  transition: margin-right 160ms var(--transition-easing);
}
.process__window--only-current .process__icon,
.process__window--focused .process__icon,
.process__window--expanded .process__icon {
  margin-right: 6px;
}
.process__window--only-icon .process__icon {
  margin-right: 0;
}
.process__inner {
  max-width: 0;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  transition: max-width 160ms var(--transition-easing);
}
.process__window--focused .process__inner,
.process__window--expanded .process__inner {
  max-width: var(--item-max-width);
}
.process__window--only-current .process__inner {
  max-width: 400px;
}
.process__name {
  margin-top: 2px;
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`;
