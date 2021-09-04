export const spotifyStyles = /* css */ `
.spotify {
  position: relative;
  background-color: var(--green);
}
.simple-bar--background-color-as-foreground .spotify {
  color: var(--green);
  background-color: transparent;
}
.spotify__inner {
  max-width: 140px;
  display: flex;
  flew-wrap: nowrap;
  overflow: hidden;
}
.spotify__slider {
  white-space: nowrap;
  transition: transform 160ms var(--transition-easing);
}
`
