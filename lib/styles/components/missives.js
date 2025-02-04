// Styles for /lib/components/missives/{missive|missives}.jsx components
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
  --gradient-size: 100px;

  position: absolute;
  top: 0;
  width: fit-content;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  box-sizing: border-box;
  background-color: var(--background);
  pointer-events: auto;
  transition: transform 160ms var(--transition-easing);
}
.missive::after {
  content: "";
  position: absolute;
  top: 0;
  height: 100%;
  width: var(--gradient-size);
  pointer-events: none;
}
.missive--left {
  left: 0;
  animation: left-missive-appearance 320ms var(--transition-easing);
}
@keyframes left-missive-appearance {
  0% {
    transform: translateX(-100%);
  }
}
.missive--left::after {
  left: 100%;
  background: linear-gradient(to right, var(--background) 0%, transparent 100%);
}
.missive--right {
  right: 0;
  flex-direction: row-reverse;
  animation: right-missive-appearance 320ms var(--transition-easing);
}
@keyframes right-missive-appearance {
  0% {
    transform: translateX(100%);
  }
}
.missive--right::after {
  right: 100%;
  background: linear-gradient(to left, var(--background) 0%, transparent 100%);
}
.missive__text {
  max-width: calc(100vw - var(--gradient-size));
  overflow: hidden;
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
  border-radius: var(--item-radius);
  transition: box-shadow 160ms var(--transition-easing);
}
.missive__close:hover {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.missive__close-icon {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
}
`;
