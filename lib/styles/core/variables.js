import * as Theme from "../theme";
import * as Settings from "../../settings";

const themedVariables = (scheme) => {
  const settings = Settings.get();
  const { themes } = settings;
  const { widgetMaxWidth, compactMode, font, fontSize } = settings.global;

  return /* css */ `
:root {
  --main: ${Theme.colors(themes)[scheme].main};
  --main-alt: ${Theme.colors(themes)[scheme].mainAlt};
  --minor: ${Theme.colors(themes)[scheme].minor};
  --accent: ${Theme.colors(themes)[scheme].yellow};
  --red: ${Theme.colors(themes)[scheme].red};
  --green: ${Theme.colors(themes)[scheme].green};
  --yellow: ${Theme.colors(themes)[scheme].yellow};
  --orange: ${Theme.colors(themes)[scheme].orange};
  --blue: ${Theme.colors(themes)[scheme].blue};
  --magenta: ${Theme.colors(themes)[scheme].magenta};
  --cyan: ${Theme.colors(themes)[scheme].cyan};
  --black: ${Theme.colors(themes)[scheme].black};
  --white: ${Theme.colors(themes)[scheme].white};
  --foreground: ${Theme.colors(themes)[scheme].foreground};
  --background: ${Theme.colors(themes)[scheme].main};
  --transparent-dark: ${Theme.colors(themes)[scheme].transparentDark};
  --font: ${
    font.trim().length ? font : Theme.colors(themes)[scheme].defaultFont
  };
  --font-size: ${fontSize.trim().length ? fontSize : "11px"};
  --bar-height: ${
    compactMode
      ? Theme.colors(themes)[scheme].compactBarHeight
      : Theme.colors(themes)[scheme].barHeight
  };
  --bar-radius: ${Theme.colors(themes)[scheme].barRadius};
  --bar-border: ${Theme.colors(themes)[scheme].barBorder};
  --bar-inner-margin: ${Theme.colors(themes)[scheme].barInnerMargin};
  --item-max-width: ${widgetMaxWidth.trim().length ? widgetMaxWidth : "160px"};
  --item-radius: ${Theme.colors(themes)[scheme].itemRadius};
  --item-inner-margin: ${Theme.colors(themes)[scheme].itemInnerMargin};
  --item-outer-margin: ${Theme.colors(themes)[scheme].itemOuterMargin};
  --hover-ring: ${Theme.colors(themes)[scheme].hoverRing};
  --focus-ring: ${Theme.colors(themes)[scheme].focusRing};
  --light-shadow: ${Theme.colors(themes)[scheme].lightShadow};
  --foreground-shadow: ${
    Theme.colors(themes)[scheme].foregroundShadow
      ? Theme.colors(themes)[scheme].foregroundShadow
      : "0 0 0 1px var(--foreground)"
  };
  --transition-easing: ${Theme.colors(themes)[scheme].transitionEasing};
  --click-effect: ${Theme.colors(themes)[scheme].clickEffect};
}
`;
};

const darkVariables = themedVariables("dark");
const lightVariables = themedVariables("light");

const buildVariables = () => {
  const settings = Settings.get();
  const { theme } = settings.global;
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
