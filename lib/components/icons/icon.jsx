import * as Uebersicht from "uebersicht";

const { React } = Uebersicht;

export default function Icon({ width = 24, height = 24, children, ...props }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      {...props}
    >
      {children}
    </svg>
  );
}

export function SuspenseIcon({ children }) {
  return (
    <React.Suspense fallback={<svg className="simple-bar-icon-loader" />}>
      {children}
    </React.Suspense>
  );
}
