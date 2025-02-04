import * as Uebersicht from "uebersicht";

const { React } = Uebersicht;

/**
 * Icon component renders an SVG element.
 *
 * @param {Object} props - The properties object.
 * @param {number} [props.width=24] - The width of the SVG.
 * @param {number} [props.height=24] - The height of the SVG.
 * @param {React.ReactNode} props.children - The children elements to be rendered inside the SVG.
 * @returns {JSX.Element} The SVG element.
 */
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

/**
 * SuspenseIcon component renders its children within a React.Suspense component.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The children elements to be rendered inside the Suspense component.
 * @returns {JSX.Element} The Suspense component with a fallback SVG loader.
 */
export function SuspenseIcon({ children }) {
  return (
    <React.Suspense fallback={<svg className="simple-bar-icon-loader" />}>
      {children}
    </React.Suspense>
  );
}
