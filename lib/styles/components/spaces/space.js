export const spaceStyles = /* css */ `
.space {
  position: relative;
  transform-origin: left;
  animation: space-appearance 320ms var(--transition-easing);
}
.space:not(:first-child) {
}
@keyframes space-appearance {
  0% {
    opacity: 0;
    transform: scale(0);
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
  transition: color 160ms var(--transition-easing), background-color 160ms var(--transition-easing), 
    border 160ms var(--transition-easing), box-shadow 160ms var(--transition-easing);
  z-index: 0;
}
.space:hover .space__inner {
  z-index: 1;
}
.space__inner:hover,
.spaces__add:hover {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.space__inner:active,
.spaces__add:active {
  box-shadow: var(--light-shadow), var(--focus-ring);
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
  box-shadow: var(--light-shadow), 0 0 1px ;
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
