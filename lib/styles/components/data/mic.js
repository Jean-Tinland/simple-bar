// Styles for /lib/components/data/mic.jsx component
export const micStyles = /* css */ `
.mic {
font-variant-numeric: tabular-nums;
  background-color: var(--orange);
  transform: translateZ(0);
}
.simple-bar--widgets-background-color-as-foreground .mic {
  color: var(--orange);
  background-color: transparent;
}
.mic__slider-container {
  --slider-size: 10px;

  position: relative;
  max-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;
  opacity: 0.7;
  border-radius: var(--item-radius);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 0ms var(--transition-easing);
}
.mic:hover .mic__slider-container,
.mic--dragging .mic__slider-container {
  max-width: 100px;
  clip-path: inset(-100vh -100vw);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 320ms 320ms var(--transition-easing)
}
.mic__slider-container:hover {
  opacity: 1;
}
.mic__slider {
  width: 100px;
  height: var(--slider-size);
  appearance: none;
  background-color: var(--background);
  border-radius: var(--item-radius);
  outline: none;
  -webkit-appearance: none;
}
.simple-bar--widgets-background-color-as-foreground .mic__slider {
  background-color: var(--foreground);
}
.mic__slider::-webkit-slider-thumb {
  width: var(--slider-size);
  height: var(--slider-size);
  background-color: var(--foreground);
  border-radius: var(--item-radius);
  cursor: pointer;
  -webkit-appearance: none;
  transform-origin: center;
  transition: transform 160ms var(--transition-easing);
}
.simple-bar--widgets-background-color-as-foreground .mic__slider::-webkit-slider-thumb {
  background-color: var(--orange);
}
.mic__slider::-webkit-slider-thumb:hover {
  transform: scale(1.5);
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
`;
