import * as Uebersicht from "uebersicht";
import Space from "./space.jsx";
import { useAerospaceContext } from "../aerospace-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";
import * as AeroSpace from "../../aerospace.js";

export { spacesStyles as styles } from "../../styles/components/spaces/spaces.js";

const { React } = Uebersicht;

/**
 * Spaces component to display spaces on the screen.
 * @returns {JSX.Element|null} The rendered component.
 */
const Component = React.memo(() => {
  // Get spaces from aerospace context
  const { spaces } = useAerospaceContext();
  // Get displays, displayIndex, and settings from simple bar context
  const { displays, displayIndex, settings } = useSimpleBarContext();
  const { spacesDisplay, process } = settings;
  const { displayAllSpacesOnAllScreens, showOnDisplay } = spacesDisplay;
  // Determine if the component should be visible on the current display
  const visible = Utils.isVisibleOnDisplay(displayIndex, showOnDisplay);
  const isProcessVisible = Utils.isVisibleOnDisplay(
    displayIndex,
    process.showOnDisplay,
  );

  // If not visible, return null
  if (!visible) return null;

  // If there are no spaces, return an empty div
  if (!spaces?.length) {
    return <div className="spaces spaces--empty" />;
  }

  // Map through displays and render spaces for the current display
  return displays.map((display) => {
    const displayId = AeroSpace.getCustomDisplayIndex(display);
    if (displayId !== displayIndex) return null;

    // Filter spaces based on display settings
    const filteredSpaces = displayAllSpacesOnAllScreens
      ? spaces
      : spaces.filter((space) => space.monitor === displayId);

    return (
      <div key={displayId} className="spaces">
        {filteredSpaces.map((space, i) => {
          const { workspace } = space;
          const lastOfSpace =
            i !== 0 && space.monitor !== spaces[i - 1].monitor;

          return (
            <Space key={workspace} space={space} lastOfSpace={lastOfSpace} />
          );
        })}
        {isProcessVisible && <div className="spaces__end-separator" />}
      </div>
    );
  });
});

Component.displayName = "Spaces";

export default Component;
