export const dataWidgetStyles = /* css */ `
.data-widget {
  display: flex;
  align-items: center;
  margin: var(--item-outer-margin);
  padding: var(--item-inner-margin);
  color: var(--background);
  font-family: var(--font);
  font-size: inherit;
  background-color: var(--minor);
  text-decoration: none;
  border-radius: var(--item-radius);
  border: 0;
  outline: none;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  box-shadow: var(--light-shadow);
  transition: all 160ms var(--transition-easing);
}
.simple-bar--no-color-in-data .data-widget {
  color: var(--foreground);
  background-color: var(--minor);
}
.simple-bar--background-color-as-foreground .data-widget {
  background-color: transparent;
  box-shadow: none;
}
.simple-bar--background-color-as-foreground.simple-bar--no-color-in-data .data-widget {
  color: var(--foreground) !important;
  background-color: transparent;
}
.data-widget--clickable {
  cursor: pointer;
}
.data-widget--clickable:hover {
  box-shadow: var(--light-shadow), var(--hover-ring);
}
.data-widget--clickable:active {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.data-widget > svg {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: currentColor;
}
`
