import { spaceStyles } from './space'
import { spaceOptionsStyles } from './space-options'

export const spacesStyles = /* css */ `
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
.spaces__separator {
  align-self: center;
  flex: 0 0 6px;
  width: 6px;
  height: 2px;
  margin: 0 7px 0 2px;
  background-color: currentColor;
}
${spaceStyles}
${spaceOptionsStyles}
.spaces__add > svg {
  width: 10px;
  height: 10px;
  fill: currentColor;
}
`
