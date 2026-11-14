// Styles for /lib/components/data/pomodoro.jsx component
export const pomodoroStyles = /* css */ `
/* Every other data widget is a direct flex item of .simple-bar__data, which is
   align-items: stretch, so it fills the bar height. This wrapper exists only to
   anchor the menu and catch middle clicks, so it must stretch its child the same
   way: centring it made the pill 20px tall next to 28px neighbours. */
.pomodoro-wrapper {
  display: flex;
  align-items: stretch;
}
.pomodoro {
  position: relative;
  overflow: hidden;
  z-index: 0;
}
.pomodoro--focus {
  background-color: var(--red);
}
.pomodoro--rest {
  background-color: var(--green);
}
.pomodoro--longrest {
  background-color: var(--magenta);
}
.pomodoro--idle {
  color: var(--foreground);
  background-color: var(--minor);
}
/* Keep every state the same size as the running one: the icon slot is fixed and
   the loader the lazy icons fall back to is forced into that same slot. */
.pomodoro > svg,
.pomodoro .simple-bar-icon-loader {
  flex: 0 0 14px;
  width: 14px;
  height: 14px;
}
.simple-bar--widgets-background-color-as-foreground .pomodoro {
  background-color: transparent;
  box-shadow: none;
}
.simple-bar--widgets-background-color-as-foreground .pomodoro--focus {
  color: var(--red);
}
.simple-bar--widgets-background-color-as-foreground .pomodoro--rest {
  color: var(--green);
}
.simple-bar--widgets-background-color-as-foreground .pomodoro--longrest {
  color: var(--magenta);
}
.simple-bar--widgets-background-color-as-foreground .pomodoro--idle {
  color: var(--foreground);
}
.simple-bar--no-color-in-data .pomodoro {
  color: var(--foreground);
  background-color: var(--minor);
}
.simple-bar--widgets-background-color-as-foreground.simple-bar--no-color-in-data .pomodoro {
  color: var(--foreground) !important;
  background-color: transparent;
}
/* A paused phase keeps the exact shape and size of a running one: the phase
   colour, the pill box and the icon slot all stay identical, and pausing is
   shown by the pause glyph and a dimmed countdown instead of an inset ring,
   which used to eat 2px off the pill on every edge. */
.pomodoro__fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  background-color: rgba(0, 0, 0, 0.15);
  transition: transform 160ms var(--transition-easing);
  pointer-events: none;
  touch-action: none;
  z-index: -1;
}
.simple-bar--widgets-background-color-as-foreground .pomodoro__fill {
  background-color: transparent;
}
.pomodoro__label {
  margin-right: 5px;
  font-weight: 600;
  opacity: 0.9;
}
.pomodoro__time {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.pomodoro--paused .pomodoro__time {
  opacity: 0.6;
}
.pomodoro__dots {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: 6px;
}
.pomodoro__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.3;
}
.pomodoro__dot--done {
  opacity: 0.9;
}
@keyframes pomodoro-ended {
  0%, 100% { box-shadow: var(--light-shadow); }
  50% { box-shadow: var(--light-shadow), 0 0 0 4px var(--accent); }
}
.pomodoro--ended {
  animation: pomodoro-ended 900ms ease-out 1;
}
.simple-bar--no-shadow .pomodoro--ended {
  box-shadow: none;
}
.simple-bar--animations-disabled .pomodoro--ended {
  animation: none;
}
/* The action strip sits inside the bar strip, just left of the pill. It must not
   hang below the bar: Übersicht owns the widget window and a widget cannot raise
   it above other applications, so anything outside the bar strip is covered as
   soon as a window is open on the workspace. */
.pomodoro-actions {
  position: fixed;
  /* Above the other widgets and the settings sheet (z-index 1) but inside the
     bar's own stacking context, so it covers the bar and nothing else */
  z-index: 2147483000;
  display: flex;
  align-items: center;
  gap: 2px;
  box-sizing: border-box;
  padding: 0 5px;
  color: var(--foreground);
  font-family: var(--font);
  font-size: var(--font-size);
  background-color: var(--main);
  border-radius: var(--item-radius);
  box-shadow: var(--light-shadow);
}
.simple-bar--no-shadow .pomodoro-actions {
  box-shadow: none;
}
.pomodoro-actions__item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
  height: 100%;
  max-height: 24px;
  padding: 0;
  color: inherit;
  background-color: transparent;
  border: 0;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  transition: background-color 160ms var(--transition-easing);
}
.pomodoro-actions__item:hover {
  background-color: var(--minor);
}
.pomodoro-actions__item:focus {
  box-shadow: var(--focus-ring);
}
.pomodoro-actions__item > svg,
.pomodoro-actions__item .simple-bar-icon-loader {
  flex: 0 0 12px;
  width: 12px;
  height: 12px;
  fill: currentColor;
}
`;
