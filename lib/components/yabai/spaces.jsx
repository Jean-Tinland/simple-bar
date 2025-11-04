import * as Uebersicht from "uebersicht";
import Space from "./space.jsx";
import Stickies from "./stickies.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import { useYabaiContext } from "../yabai-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";
import * as Yabai from "../../yabai";

export { spacesStyles as styles } from "../../styles/components/spaces/spaces";

const { React } = Uebersicht;

/**
 * Spaces component to display spaces and manage space-related actions.
 * @returns {JSX.Element|null} The rendered component.
 */
const Component = React.memo(() => {
  // Get spaces and windows data from Yabai context
  const { spaces, windows } = useYabaiContext();
  // Get various settings and display information from simple-bar context
  const { SIPDisabled, displayIndex, displays, settings } =
    useSimpleBarContext();
  const { spacesDisplay, process } = settings;
  const {
    displayStickyWindowsSeparately,
    spacesExclusions,
    exclusionsAsRegex,
    hideCreateSpaceButton,
    showOnDisplay,
  } = spacesDisplay;
  // Determine if the component should be visible on the current display
  const visible = Utils.isVisibleOnDisplay(displayIndex, showOnDisplay);
  const isProcessVisible = Utils.isVisibleOnDisplay(
    displayIndex,
    process.showOnDisplay,
  );

  if (!visible) return null;

  if (!spaces && !windows) {
    return <div className="spaces spaces--empty" />;
  }

  // Find the current space index
  const { index: currentSpaceIndex } =
    spaces.find((space) => {
      const { "has-focus": hasFocus, focused: __legacyHasFocus } = space;
      return hasFocus ?? __legacyHasFocus;
    }) || {};

  return displays.map((display, i) => {
    if (display.index !== displayIndex) return null;

    /**
     * Handle click event to create a new space.
     * @param {Event} e - The click event.
     */
    const onClick = async (e) => {
      Utils.clickEffect(e);
      await Yabai.createSpace(displayIndex);
    };

    return (
      <div key={i} className="spaces">
        {displayStickyWindowsSeparately && <Stickies display={display} />}
        {spaces.map((space, i) => {
          const { label, index } = space;
          const lastOfSpace =
            i !== 0 && space.display !== spaces[i - 1].display;

          const key = label?.length ? label : index;
          const spacesExclusionsList =  spacesExclusions.replace(/ /g, "").split(",");
          const isExcluded = Utils.isSpaceExcluded(
            key,
            spacesExclusionsList,
            exclusionsAsRegex,
          );

          if (isExcluded) return null;

          return (
            <Space
              key={key}
              display={display}
              space={space}
              currentSpaceIndex={currentSpaceIndex}
              lastOfSpace={lastOfSpace}
            />
          );
        })}
        {SIPDisabled && !hideCreateSpaceButton ? (
          <button className="spaces__add" onClick={onClick}>
            <SuspenseIcon>
              <Icons.Add />
            </SuspenseIcon>
          </button>
        ) : (
          isProcessVisible && <div className="spaces__end-separator" />
        )}
      </div>
    );
  });
});

Component.displayName = "Spaces";

export default Component;
