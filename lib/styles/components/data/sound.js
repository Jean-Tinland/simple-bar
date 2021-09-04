export const soundStyles = /* css */ `
.sound {
  background-color: var(--blue);
  transform: translateZ(0);
}
.simple-bar--background-color-as-foreground .sound {
  color: var(--blue);
  background-color: transparent;
}
.sound__slider-container {
  position: relative;
  max-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;
  opacity: 0.7;
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing);
}
.sound:hover .sound__slider-container,
.sound--dragging .sound__slider-container {
  max-width: 100px;
  padding: 0 2px;
}
.sound__slider-container:hover {
  opacity: 1;
}
.sound__slider {
  width: 100px;
  height: 2px;
  appearance: none;
  background-color: var(--background);
  outline: none;
  -webkit-appearance: none;
}
.simple-bar--background-color-as-foreground .sound__slider {
  background-color: var(--foreground);
}
.sound__slider::-webkit-slider-thumb {
  width: 8px;
  height: 8px;
  background-color: var(--foreground);
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  transition: width 160ms var(--transition-easing), height 160ms var(--transition-easing)
}
.simple-bar--background-color-as-foreground .sound__slider::-webkit-slider-thumb {
  background-color: var(--blue);
}
.sound__slider::-webkit-slider-thumb:hover {
  width: 10px;
  height: 10px;
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
.simple-bar--background-color-as-foreground .sound__slider-filler {
  background-color: var(--blue);
}
.sound__display {
  display: flex;
  align-items: center;
  margin-right: 4px;
  overflow: hidden;
}
.sound__display:active {
  color: currentColor;
}
.sound__display > svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-right: 3px;
  fill: currentColor;
}
`
