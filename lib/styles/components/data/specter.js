export const SpecterStyles = /* css */ `
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
.specter > span {
  flex: 0 0 5px;
  height: 15px;
  max-height: 4px;
  margin-left: 1px;
  background-color: var(--main);
  opacity: 0.1;
  transition: max-height 160ms var(--transition-easing);
}
.specter > span:nth-of-type(1) {
  animation: specter-waving 640ms -460ms var(--transition-easing) infinite;
}
.specter > span:nth-of-type(2) {
  animation: specter-waving 640ms -320ms var(--transition-easing) infinite;
}
.specter > span:nth-of-type(3) {
  animation: specter-waving 640ms -200ms var(--transition-easing) infinite;
}
.specter > span:nth-of-type(4) {
  animation: specter-waving 640ms -240ms var(--transition-easing) infinite;
}
.specter > span:nth-of-type(5) {
  animation: specter-waving 640ms -150ms var(--transition-easing) infinite;
}
@keyframes specter-waving {
  50% {
    max-height: 15px;
  }
}
`
