export const spaceStyles = /* css */ `
.space, .stickies {
  position: relative;
  display: flex;
  align-items: center;
  animation: space-appearance 320ms var(--transition-easing);
}

@keyframes space-appearance {
  0% {
    opacity: 0;
  }
}
.space__inner,
.spaces__add,
.stickies__inner {
  height: 100%;
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
.stickies__inner {
  background-color: var(--background);
  box-shadow: none;
  cursor: default;
}
.simple-bar--background-color-as-foreground .space__inner,
.simple-bar--background-color-as-foreground .spaces__add,
.simple-bar--background-color-as-foreground .stickies__inner {
  background-color: transparent;
  box-shadow: none;
}
.space:first-of-type .space__inner {
  margin-left: 0;
}
.space:hover .space__inner {
  z-index: 1;
}
.spaces__add {
  height: auto;
  background-color: transparent;
  box-shadow: none;
}
.spaces__add:hover {
  background-color: var(--minor);
}
.space--fullscreen .space__inner {
  color: var(--minor);
  background-color: var(--yellow);
}
.simple-bar--background-color-as-foreground .space--fullscreen .space__inner {
  color: var(--yellow);
  background-color: transparent;
}
.space--focused .space__inner {
  color: var(--minor);
  background-color: var(--active-space);
}
.simple-bar--background-color-as-foreground .space--focused .space__inner {
  color: var(--minor);
  background-color: var(--active-space);
}
.space--visible .space__inner {
  box-shadow: var(--light-shadow), 0 0 0 1px var(--active-space);
}
.space:not(.space--focused) .space__inner:hover,
.spaces__add:hover {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.space:not(.space--focused) .space__inner:active,
.spaces__add:active {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.space__label {
  display: block;
  margin: 0;
  color: currentColor;
  font-family: inherit;
  font-size: var(--font-size);
  line-height: 1;
  text-align: center;
  background-color: transparent;
  border: 0;
  border-radius: 2px;
  outline: none;
}
.space__label:not(:read-only):focus {
  box-shadow: var(--focus-ring);
}
.space__icon {
  flex: 0 0 11px;
  width: 15px;
  height: 15px;
  margin-left: 6px;
  fill: currentColor;
  opacity: 0.5;
  transform: translateZ(0);
}
.space__label + .space__icon {
  // margin-left: 0;
}
.stickies__inner .space__icon:first-child {
  margin: 0;
}
.space__icon--focused {
  opacity: 1;
}
.space__icon--fullscreen {
  fill: var(--yellow);
}
.space--focused .space__icon--fullscreen {
  stroke: rgba(0, 0, 0, 0.3);
  stroke-width: 2px;
}
`
