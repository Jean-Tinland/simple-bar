export const dndStyles = /* css */ `
.dnd {
  position: relative;
  background-color: var(--orange);
  overflow: hidden;
  z-index: 0;
}
.simple-bar--background-color-as-foreground .dnd {
  color: var(--orange);
  background-color: transparent;
}
.dnd--no-label > svg {
  margin-right: 0;
}
`
