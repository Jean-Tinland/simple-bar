// Styles for /lib/components/data/netstats.jsx component
export const netstatsStyles = /* css */ `
.netstats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  color: var(--foreground);
  background-color: var(--minor);
  z-index: 0;
}
.netstats--graph {
  min-width: 120px;
  padding: 0;
}
.simple-bar--widgets-background-color-as-foreground .netstats {
  background-color: transparent;
}
.netstats__item {
  width: 9ch;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 4px;
}
.netstats__value {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  margin: 0 auto;
}
.netstats__value > em {
  font-size: 0.8em;
  font-style: normal;
}
.netstats__icon {
  flex: 0 0 12px;
  width: 12px;
  height: 12px;
}
.netstats__icon--download {
  fill: var(--magenta);
}
.netstats__icon--upload {
  fill: var(--blue);
}
`;
