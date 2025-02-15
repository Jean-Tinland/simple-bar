// Styles for /lib/components/{yabai|aerospace|flashspace}/*.jsx components
import { spaceStyles } from "./space";
import { spaceOptionsStyles } from "./space-options";

export const styles = /* css */ `
.spaces {
  flex: 0 0 auto;
  display: flex;
  align-items: stretch;
}
.simple-bar--no-bar-background .spaces {
  padding: 4px 5px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
}
.simple-bar--no-bar-background.simple-bar--no-shadow .spaces {
  box-shadow: none;
}
.simple-bar--process-aligned-to-left .spaces {
  margin-right: 4px;
}
.spaces__separator {
  align-self: center;
  flex: 0 0 5px;
  width: 5px;
  height: 5px;
  margin: var(--item-outer-margin);
  background-color: var(--foreground);
  border-radius: 50%;
  opacity: 0.35;
}
${spaceStyles}
${spaceOptionsStyles}
.spaces__add > svg {
  width: 10px;
  height: 10px;
  fill: currentColor;
}
.spaces__end-separator {
  align-self: center;
  flex: 0 0 4px;
  width: 4px;
  height: 4px;
  margin: var(--item-outer-margin);
  background-color: var(--main-alt);
  border-radius: 50%;
  opacity: 0.35;
}
`;
