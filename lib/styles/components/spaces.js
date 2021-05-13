export const SpacesStyles = /* css */ `
.spaces {
  flex: 0 0 auto;
  display: flex;
  list-style: none;
}
.simple-bar--no-bar-background .spaces {
  padding: 4px 5px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: 3px;
}
.space-separator {
  align-self: center;
  flex: 0 0 6px;
  width: 6px;
  height: 2px;
  margin: 0 7px 0 2px;
  background-color: white;
}
.space {
  position: relative;
  transform-origin: left;
  animation: space-appearance 320ms var(--transition-easing);
}
.space--stack {
  font-weight: 700;
}
@keyframes space-appearance {
  0% {
    opacity: 0;
    transform: scale(0);
  }
}
.space__inner,
.spaces__add {
  display: flex;
  align-items: center;
  margin-right: 5px;
  padding: 2px 5px;
  background-color: var(--minor);
  border-radius: 2px;
  border: 1px solid transparent;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: color 160ms var(--transition-easing), background-color 160ms var(--transition-easing), 
    border 160ms var(--transition-easing), box-shadow 160ms var(--transition-easing), 
    transform 160ms var(--transition-easing);
  z-index: 0;
}
.space:hover .space__inner {
  z-index: 1;
}
.spaces__add {
  margin-right: 0;
  background-color: transparent;
  box-shadow: none;
}
.spaces__add:hover {
  background-color: var(--minor);
  box-shadow: var(--light-shadow);
}
.space__inner:active,
.spaces__add:active {
  transform: translateZ(0) scale(0.85);
}
.space--fullscreen .space__inner {
  color: var(--minor);
  background-color: var(--yellow);
}
.space--focused .space__inner {
  color: var(--minor);
  background-color: white;
}
.space--visible .space__inner {
  border: 1px solid rgba(255, 255, 255, 0.3);
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
.space-options {
  position: absolute;
  top: calc(100% + 3px);
  left: -2px;
  height: 90%;
  width: 50px;
  height: 18px;
  display: flex;
  align-items: stretch;
  background-color: #fff;
  opacity: 0;
  pointer-events: none;
  touch-action: none;
  border-radius: 3px;
  box-shadow: var(--light-shadow);
  transform-origin: top center;
  transform: translateZ(0) scale(0);
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
  z-index: 1;
}
.simple-bar--on-bottom  .space-options {
  top: unset;
  bottom: calc(100% + 3px);
  left: -2px;
  transform-origin: bottom center;
}
.simple-bar--inline-spaces-options .space-options {
  width: 60px;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 3px;
  transform-origin: center;
}
.space--hovered .space-options {
  opacity: 1;
  transform: translateZ(0);
  pointer-events: auto;
  touch-action: auto;
  transition: opacity 160ms 1s var(--transition-easing), transform 160ms 1s var(--transition-easing);
}
.space--hovered.space--no-delay .space-options {
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
}
.space-options::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 2;
}
.space-options::after {
  content: '';
  position: absolute;
  top: -3px;
  left: 8px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 3px solid #fff;
}
.simple-bar--on-bottom  .space-options::after {
  content: '';
  top: unset;
  bottom: -3px;
  left: 8px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 3px solid #fff;
  border-bottom: none;
}
.simple-bar--inline-spaces-options .space-options::after {
  content: none;
}
.space-options__option {
  position: relative;
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: background-color 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.space-options__option:last-child {
  opacity: 0.8;
  background-color: var(--red);
}
.space--fullscreen .space-options__option:last-child,
.space:first-of-type:only-of-type .space-options__option:last-child,
.space:first-of-type:nth-last-of-type(2) .space-options__option:last-child {
  pointer-events: none;
  touch-action: none;
  opacity: 0.5;
  filter: grayscale(100%);
}
.space:first-of-type .space-options__option--move-prev,
.space:nth-last-of-type(2) .space-options__option--move-next,
.space:first-of-type:only-of-type .space-options__option--move-prev,
.space:first-of-type:only-of-type .space-options__option--move-next,
.space:first-of-type:nth-last-of-type(2) .space-options__option--move-prev,
.space:first-of-type:nth-last-of-type(2) .space-options__option--move-next {
  opacity: 0.2;
  pointer-events: none;
  touch-action: none;
}
.space .space-options__option:first-of-type {
  border-radius: 3px 0 0 3px;
}
.space-options__option:last-of-type {
  border-radius: 0 3px 3px 0;
}
.space-options__option:not(:last-child):hover {
  background-color: var(--light-grey);
}
.space-options__option:last-child:hover {
  opacity: 1;
}
.space-options__option > svg {
  width: 8px;
  height: 8px;
  fill: var(--main);
  curor: pointer;
  user-select: none;
}
.space-options__option:last-child > svg {
  fill: #fff;
}
.spaces__add > svg {
  width: 10px;
  height: 10px;
  fill: #fff;
}
`
