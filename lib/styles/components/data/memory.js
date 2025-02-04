// Styles for /lib/components/data/memory.jsx component
export const memoryStyles = /* css */ `
.memory {
  color: var(--foreground);
  background-color: var(--minor);
}
.memory--low {
  --pie-color: var(--green);
}
.memory--medium {
  --pie-color: var(--yellow);
}
.memory--high {
  --pie-color: var(--red);
}
.memory__pie {
  flex: 0 0 21px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
}
.memory__content {
  display: flex;
  gap: 4px;
  padding-left: 5px;
}
.memory--high .memory__content {
  color: var(--red);
}
`;
