import * as Theme from "../theme";
import * as Settings from "../../settings";

const settings = Settings.get();
const { widgetMaxWidth, compactMode, font, fontSize, theme } = settings.global;

const themedVariables = (scheme) => /* css */ `
:root {
  --main: ${Theme.colors[scheme].main};
  --main-alt: ${Theme.colors[scheme].mainAlt};
  --minor: ${Theme.colors[scheme].minor};
  --accent: ${Theme.colors[scheme].yellow};
  --red: ${Theme.colors[scheme].red};
  --green: ${Theme.colors[scheme].green};
  --yellow: ${Theme.colors[scheme].yellow};
  --orange: ${Theme.colors[scheme].orange};
  --blue: ${Theme.colors[scheme].blue};
  --magenta: ${Theme.colors[scheme].magenta};
  --cyan: ${Theme.colors[scheme].cyan};
  --black: ${Theme.colors[scheme].black};
  --white: ${Theme.colors[scheme].white};
  --foreground: ${Theme.colors[scheme].foreground};
  --background: ${Theme.colors[scheme].main};
  --transparent-dark: ${Theme.colors[scheme].transparentDark};
  --font: ${font.trim().length ? font : Theme.colors[scheme].defaultFont};
  --font-size: ${fontSize.trim().length ? fontSize : "11px"};
  --bar-height: ${
    compactMode
      ? Theme.colors[scheme].compactBarHeight
      : Theme.colors[scheme].barHeight
  };
  --bar-radius: ${Theme.colors[scheme].barRadius};
  --bar-border: ${Theme.colors[scheme].barBorder};
  --bar-inner-margin: ${Theme.colors[scheme].barInnerMargin};
  --item-max-width: ${widgetMaxWidth.trim().length ? widgetMaxWidth : "160px"};
  --item-radius: ${Theme.colors[scheme].itemRadius};
  --item-inner-margin: ${Theme.colors[scheme].itemInnerMargin};
  --item-outer-margin: ${Theme.colors[scheme].itemOuterMargin};
  --hover-ring: ${Theme.colors[scheme].hoverRing};
  --focus-ring: ${Theme.colors[scheme].focusRing};
  --light-shadow: ${Theme.colors[scheme].lightShadow};
  --foreground-shadow: ${
    Theme.colors[scheme].foregroundShadow
      ? Theme.colors[scheme].foregroundShadow
      : "0 0 0 1px var(--foreground)"
  };
  --transition-easing: ${Theme.colors[scheme].transitionEasing};
  --click-effect: ${Theme.colors[scheme].clickEffect};
}
`;

const darkVariables = themedVariables("dark");
const lightVariables = themedVariables("light");

const buildVariables = () => {
  if (theme === "auto") {
    return /* css */ `
      @media (prefers-color-scheme: light) {
        ${lightVariables}
      }
      @media (prefers-color-scheme: dark) {
        ${darkVariables}
      }
    `;
  }
  if (theme === "light") return lightVariables;
  return darkVariables;
};

export const styles = buildVariables();
