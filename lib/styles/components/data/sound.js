export const soundStyles = /* css */ `
.sound {
  background-color: var(--blue);
  transform: translateZ(0);
}
.sound__slider-container {
  position: relative;
  max-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: max-width 160ms 640ms var(--transition-easing), padding 160ms 640ms var(--transition-easing);
}
.sound:hover .sound__slider-container {
  max-width: 70px;
  padding: 0 2px;
  transition: max-width 160ms var(--transition-easing), padding 160ms var(--transition-easing);
}
.sound__slider {
  width: 70px;
  height: 2px;
  appearance: none;
  background-color: var(--background);
  outline: none;
  -webkit-appearance: none;
}
.sound__slider::-webkit-slider-thumb {
  width: 8px;
  height: 8px;
  background-color: var(--foreground);
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
}
.sound__slider-filler {
  position: absolute;
  top: calc(50% - 1px);
  left: 4px;
  width: calc(100% - 8px);
  height: 2px;
  background-color: var(--foreground);
  transform-origin: left;
}
.sound__toggle {
  max-width: 60px;
  display: flex;
  align-items: center;
  padding: 2px 0 2px 2px;
  color: var(--background);
  background-color: transparent;
  border: 0;
  border-radius: var(--item-radius);
  outline: none;
  cursor: pointer;
  overflow: hidden;
  transition: max-width 160ms 640ms var(--transition-easing), padding 160ms 640ms var(--transition-easing);
}
.sound:hover .sound__toggle {
  max-width: 0;
  padding: 0;
  transition: max-width 160ms var(--transition-easing), padding 160ms var(--transition-easing);
}
.sound__toggle:active {
  color: currentColor;
}
.sound__toggle > svg {
  flex: 0 0 14px;
  height: 14px;
  margin-right: 3px;
  fill: currentColor;
}
`
