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

export const Wifi = (props) => (
  <Icon {...props}>
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </Icon>
);

export const WifiOff = (props) => (
  <Icon {...props}>
    <path d="M21 11l2-2c-3.73-3.73-8.87-5.15-13.7-4.31l2.58 2.58c3.3-.02 6.61 1.22 9.12 3.73zM9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm10-4c-1.08-1.08-2.36-1.85-3.72-2.33l3.02 3.02.7-.69zM3.41 1.64L2 3.05 5.05 6.1C3.59 6.83 2.22 7.79 1 9l2 2c1.23-1.23 2.65-2.16 4.17-2.78l2.24 2.24C7.79 10.89 6.27 11.74 5 13l2 2c1.35-1.35 3.11-2.04 4.89-2.06l7.08 7.08 1.41-1.41L3.41 1.64z" />
  </Icon>
);
