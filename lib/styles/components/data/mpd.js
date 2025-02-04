// Styles for /lib/components/data/mpd.jsx component
export const mpdStyles = /* css */ `
.mpd {
  position: relative;
  background-color: var(--cyan);
}
.simple-bar--widgets-background-color-as-foreground .mpd {
  color: var(--cyan);
  background-color: transparent;
}
.mpd__outer {
  display: flex;
  gap: 4px;
}
.mpd__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.mpd__info {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
.mpd__slider-container {
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
.mpd:hover .mpd__slider-container,
.mpd--dragging .mpd__slider-container {
  max-width: 100px;
  clip-path: inset(-100vh -100vw);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 320ms 320ms var(--transition-easing)
}
.mpd__slider-container:hover {
  opacity: 1;
}
.mpd__slider {
  width: 100px;
  height: var(--slider-size);
  appearance: none;
  background-color: var(--background);
  border-radius: var(--item-radius);
  outline: none;
  -webkit-appearance: none;
}
.simple-bar--widgets-background-color-as-foreground .mpd__slider {
  background-color: var(--foreground);
}
.mpd__slider::-webkit-slider-thumb {
  width: var(--slider-size);
  height: var(--slider-size);
  background-color: var(--foreground);
  border-radius: var(--item-radius);
  cursor: pointer;
  -webkit-appearance: none;
  transform-origin: center;
  transition: transform 160ms var(--transition-easing);
}
.simple-bar--widgets-background-color-as-foreground .mpd__slider::-webkit-slider-thumb {
  background-color: var(--blue);
}
.mpd__slider::-webkit-slider-thumb:hover {
  transform: scale(1.5);
}
`;
