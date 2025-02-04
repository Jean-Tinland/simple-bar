// Styles for /lib/components/data/sound.jsx component
export const soundStyles = /* css */ `
.sound {
  font-variant-numeric: tabular-nums;
  background-color: var(--blue);
  transform: translateZ(0);
}
.simple-bar--widgets-background-color-as-foreground .sound {
  color: var(--blue);
  background-color: transparent;
}
.sound__slider-container {
  --slider-size: 10px;

  position: relative;
  max-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  clip-path: inset(0);
  opacity: 0.7;
  border-radius: var(--item-radius);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 0ms var(--transition-easing);
}
.sound:hover .sound__slider-container,
.sound--dragging .sound__slider-container {
  max-width: 100px;
  clip-path: inset(-100vh -100vw);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 320ms 320ms var(--transition-easing)
}
.sound__slider-container:hover {
  opacity: 1;
}
.sound__slider {
  width: 100px;
  height: var(--slider-size);
  appearance: none;
  background-color: var(--background);
  border-radius: var(--item-radius);
  outline: none;
  -webkit-appearance: none;
}
.simple-bar--widgets-background-color-as-foreground .sound__slider {
  background-color: var(--foreground);
}
.sound__slider::-webkit-slider-thumb {
  width: var(--slider-size);
  height: var(--slider-size);
  background-color: var(--foreground);
  border-radius: var(--item-radius);
  cursor: pointer;
  -webkit-appearance: none;
  transform-origin: center;
  transition: transform 160ms var(--transition-easing);
}
.simple-bar--widgets-background-color-as-foreground .sound__slider::-webkit-slider-thumb {
  background-color: var(--blue);
}
.sound__slider::-webkit-slider-thumb:hover {
  transform: scale(1.5);
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
`;
