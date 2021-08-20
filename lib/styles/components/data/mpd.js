export const mpdStyles = /* css */ `
.mpd {
  position: relative;
  background-color: var(--cyan);
}
.simple-bar--background-color-as-foreground .mpd {
  color: var(--cyan);
  background-color: transparent;
}
.mpd__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.mpd__slider {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
