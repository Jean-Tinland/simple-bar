// Styles for /lib/components/data/graph.jsx component
export const graphStyles = /* css */ `
.graph {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  overflow: hidden;
  border-radius: inherit;
}
.graph__bars {
  flex: 1 1 100%;
  height: 75%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
}
.graph__bar {
  min-height: 1px;
  opacity: 0.75;
}
.graph__data {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(100% - 6px);
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 2px;
}
.graph__data-item {
  display: flex;
  align-items: center;
  gap: 3px;
}
.graph__data-item-icon {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  fill: currentColor;
}
.graph__data-item-value {
  font-size: calc(var(--font-size) - 2px);
}
`;
