// Styles for /lib/components/data/zoom.jsx component
export const zoomStyles = /* css */ `
.zoom {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--minor);
}
.simple-bar--widgets-background-color-as-foreground .zoom {
  color: var(--minor);
  background-color: transparent;
}
.simple-bar--no-color-in-data .zoom {
  background-color: var(--minor);
}
.zoom__icon {
  width: 14px;
  height: 14px;
  fill: var(--red);
  margin: 0 1px 0 4px;
  transform: translateZ(0);
}
.zoom__icon--on {
  fill: var(--green);
}
`;
