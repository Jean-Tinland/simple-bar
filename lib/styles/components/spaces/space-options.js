export const spaceOptionsStyles = /* css */ `
.space-options {
  position: absolute;
  top: calc(100% + 3px);
  left: calc(50% - 22px);
  height: 90%;
  width: 50px;
  height: 18px;
  display: flex;
  align-items: stretch;
  background-color: var(--white);
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
  transform-origin: bottom center;
}
.simple-bar--inline-spaces-options .space-options {
  height: 100%;
  top: 0;
  left: 100%;
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
  left: calc(50% - 4px);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 3px solid var(--white);
}
.simple-bar--on-bottom  .space-options::after {
  top: unset;
  bottom: -3px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 3px solid var(--white);
  border-bottom: none;
}
.simple-bar--inline-spaces-options .space-options::after {
  top: calc(50% - 4px);
  left: -3px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-right: 3px solid var(--white);
  border-left: none;
}
.space-options__option {
  position: relative;
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
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
.space:nth-last-of-type(1) .space-options__option--move-next,
.space:first-of-type:only-of-type .space-options__option--move-prev,
.space:first-of-type:only-of-type .space-options__option--move-next,
.space:first-of-type:nth-last-of-type(1) .space-options__option--move-prev,
.space:first-of-type:nth-last-of-type(1) .space-options__option--move-next {
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
  background-color: var(--transparent-dark);
}
.space-options__option:last-child:hover {
  opacity: 1;
}
.space-options__option > svg {
  width: 8px;
  height: 8px;
  fill: var(--black);
  curor: pointer;
  user-select: none;
  -webkit-user-select: none;
}
.space-options__option:last-child > svg {
  fill: var(--white);
}
`;
