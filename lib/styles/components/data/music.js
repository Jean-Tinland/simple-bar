export const musicStyles = /* css */ `
.music {
  position: relative;
  background-color: var(--green);
}
.simple-bar--background-color-as-foreground .music {
  color: var(--green);
  background-color: transparent;
}
.music__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.music__slider {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
