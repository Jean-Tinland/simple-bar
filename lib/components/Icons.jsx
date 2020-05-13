const Icon = ({ width = 24, height = 24, ...props }) => (
  <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...props}>
    {props.children}
  </svg>
);

export const Charging = (props) => (
  <Icon {...props}>
    <path d="M7 2v11h3v9l7-12h-4l3-8z" />
  </Icon>
);
