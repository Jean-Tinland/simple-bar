export const spaceStyles = /* css */ `
.space {
  position: relative;
  animation: space-appearance 320ms var(--transition-easing);
}
@keyframes space-appearance {
  0% {
    opacity: 0;
  }
}
.space__inner,
.spaces__add {
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
.space--focused .space__inner {
  color: var(--minor);
  background-color: var(--foreground);
}
.space--visible .space__inner {
  box-shadow: var(--light-shadow), 0 0 0 1px var(--foreground);
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
  color: currentColor;
  font-family: inherit;
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
  width: 11px;
  height: 11px;
  margin-left: 6px;
  fill: currentColor;
  opacity: 0.5;
  transform: translateZ(0);
}
.space__label + .space__icon {
  // margin-left: 0;
}
.space__icon--focused {
  opacity: 1;
}
`
