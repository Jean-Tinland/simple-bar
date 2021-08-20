export const micStyles = /* css */ `
.mic {
  background-color: var(--orange);
  transform: translateZ(0);
}
.simple-bar--background-color-as-foreground .mic {
  color: var(--orange);
  background-color: transparent;
}
.mic__slider-container {
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
.mic:hover .mic__slider-container,
.mic--dragging .mic__slider-container {
  max-width: 100px;
  padding: 0 2px;
}
.mic__slider-container:hover {
  opacity: 1;
}
.mic__slider {
  width: 100px;
  height: 2px;
  appearance: none;
  background-color: var(--background);
  outline: none;
  -webkit-appearance: none;
}
.simple-bar--background-color-as-foreground .mic__slider {
  background-color: var(--foreground);
}
.mic__slider::-webkit-slider-thumb {
  width: 8px;
  height: 8px;
  background-color: var(--foreground);
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  transition: width 160ms var(--transition-easing), height 160ms var(--transition-easing)
}
.simple-bar--background-color-as-foreground .mic__slider::-webkit-slider-thumb {
  background-color: var(--orange);
}
.mic__slider::-webkit-slider-thumb:hover {
  width: 10px;
  height: 10px;
}
.mic__slider-filler {
  position: absolute;
  top: calc(50% - 1px);
  left: 4px;
  width: calc(100% - 8px);
  height: 2px;
  background-color: var(--foreground);
  transform-origin: left;
}
.simple-bar--background-color-as-foreground .mic__slider-filler {
  background-color: var(--orange);
}
.mic__display {
  display: flex;
  align-items: center;
  margin-right: 4px;
  overflow: hidden;
}
.mic__display:active {
  color: currentColor;
}
.mic__display > svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-right: 3px;
  fill: currentColor;
}
`
