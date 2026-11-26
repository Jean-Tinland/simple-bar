export const theme = {
  name: "Tokyo Night Day",
  kind: "light",
  // tokyonight.nvim "day" style, computed upstream by inverting the night palette
  main: "#e1e2e7", // bg
  mainAlt: "#c4c8da", // bg_highlight
  minor: "#d0d5e3", // bg_dark
  red: "#f52a65", // red
  green: "#587539", // green
  yellow: "#8c6c3e", // yellow
  orange: "#b15c00", // orange
  blue: "#2e7de9", // blue
  magenta: "#9854f1", // magenta
  cyan: "#007197", // cyan
  black: "#3760bf", // fg
  white: "#e1e2e7", // bg
  foreground: "#3760bf", // fg
  transparentDark: "rgba(0, 0, 0, 0.05)",
  defaultFont: "JetBrains Mono, Monaco, Menlo, monospace",
  barHeight: "34px",
  compactBarHeight: "28px",
  barRadius: "9px",
  barBorder: "0px solid transparent",
  barInnerMargin: "0px",
  itemRadius: "5px",
  itemInnerMargin: "0px 9px",
  itemOuterMargin: "0 0 0 4px",
  // A white ring would be invisible on a light bar, so the rings use the theme's
  // own ink colour
  hoverRing: "0 0 0 2px rgba(55, 96, 191, 0.35)",
  focusRing: "0 0 0 2px rgb(55, 96, 191)",
  lightShadow: "0 5px 10px rgba(0, 0, 0, 0.24)",
  transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  clickEffect: "rgba(0, 0, 0, 0.15)",
};
