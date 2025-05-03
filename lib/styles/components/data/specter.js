// Styles for /lib/components/data/specter.jsx component
export const specterStyles = /* css */ `
.specter {
  position: absolute;
  bottom: 0;
  right: 30px;
  display: flex;
  align-items: flex-end;
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.simple-bar--animations-disabled .specter {
  display: none;
}
.specter > span {
  flex: 0 0 5px;
  height: 15px;
  max-height: 15px;
  margin-left: 1px;
  background-color: var(--main);
  opacity: 0.1;
  transform-origin: bottom;
}
.simple-bar--no-color-in-data .specter > span,
.simple-bar--widgets-background-color-as-foreground .specter > span {
  background-color: currentColor;
}
.specter > span {
  animation: specter-waving 640ms var(--transition-easing) infinite;
}
.simple-bar--animations-disabled .specter > span {
  animation: none;
}
.specter > span:nth-of-type(1) {
  animation-delay: -460ms;
}
.specter > span:nth-of-type(2) {
  animation-delay: -320ms;
}
.specter > span:nth-of-type(3) {
  animation-delay: -200ms;
}
.specter > span:nth-of-type(4) {
  animation-delay: -240ms;
}
.specter > span:nth-of-type(5) {
  animation-delay: -150ms;
}
@keyframes specter-waving {
  50% {
    transform: scaleY(0.2);
  }
}
`;
