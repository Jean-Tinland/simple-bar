export const dndStyles = /* css */ `
.dnd {
  position: relative;
  background-color: var(--foreground);
  overflow: hidden;
  z-index: 0;
}
.simple-bar--background-color-as-foreground .dnd {
  color: var(--foreground);
  background-color: transparent;
}
.dnd--no-label > svg {
  margin-right: 0;
}
`
