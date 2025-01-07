export const missivesStyles = /* css */ `
.missives {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
.missive {
  position: absolute;
  top: 0;
  width: fit-content;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  pointer-events: auto;
  transition: transform 160ms var(--transition-easing);
}
.missive--left {
  left: 0;
  padding: 6px 50px 6px 10px;
  background: linear-gradient(90deg, var(--background), var(--background) 80%, transparent);
  animation: left-missive-appearance 320ms var(--transition-easing);
}
@keyframes left-missive-appearance {
  0% {
    transform: translateX(-100%);
  }
}
.missive--right {
  right: 0;
  flex-direction: row-reverse;
  margin-left: auto;
  padding: 6px 10px 6px 50px;
  background: linear-gradient(270deg, var(--background), var(--background) 80%, transparent);
  animation: right-missive-appearance 320ms var(--transition-easing);
}
@keyframes right-missive-appearance {
  0% {
    transform: translateX(100%);
  }
}
.missive__close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--foreground);
  background-color: transparent;
  border: 0;
  cursor: pointer;
  user-select: none;
}
.missive__close-icon {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
}
`;
