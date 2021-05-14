export const zoomStyles = /* css */ `
.zoom {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: var(--minor);
  border-radius: var(--item-radius);
  box-shadow: var(--light-shadow);
}
.simple-bar--no-color-in-data .zoom {
  background-color: var(--minor);
}
.zoom__icon {
  width: 14px;
  height: 14px;
  fill: var(--main);
  margin: 0 1px 0 4px;
}
.simple-bar--no-color-in-data .zoom__icon,
.simple-bar--no-color-in-data .zoom__icon--on,
.simple-bar--no-color-in-data .zoom__icon--off {
  fill: var(--white);
}
.zoom__icon--on {
  fill: var(--red);
}
`
