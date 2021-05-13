export const ProcessStyles = /* css */ `
.process {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 60px;
  min-height: 12px;
  max-width: 20%;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border-radius: 4px;
}
.simple-bar--no-bar-background .process {
  height: 20px;
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: var(--background);
  box-shadow: var(--light-shadow);
  border-radius: 3px;
}
`
