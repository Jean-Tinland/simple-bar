export const customStyles = /* css */ `
/* Add your custom styles here:
.simple-bar {

}
*/
:root {
  --bar-height: 40px;
  --bar-radius: 12px;
  --item-radius: 8px;
  --bar-inner-margin: 6px ;
  --item-inner-margin: 3px 12px;
  --item-outer-margin: 0 0 0 6px;

  --distance-from-edge: 20px;
}
.simple-bar--floating {
  top: var(--distance-from-edge);
}
.simple-bar--floating.simple-bar--spaces {
  left: var(--distance-from-edge);
  width: calc(100% - (var(--distance-from-edge) * 2));
}
.simple-bar--floating.simple-bar--data {
  right: var(--distance-from-edge);
}
`
