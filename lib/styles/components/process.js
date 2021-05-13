export const processStyles = /* css */ `
.process {
  min-width: 60px;
  min-height: 12px;
  max-width: 20%;
  display: block;
  margin: 0 auto;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-radius: 4px;
}
.simple-bar--no-bar-background .process {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: var(--bar-radius);
}
`
