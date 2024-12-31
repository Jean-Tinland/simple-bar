import * as Uebersicht from "uebersicht";
import Space from "./space.jsx";
import { useAerospaceContext } from "../aerospace-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

export { spacesStyles as styles } from "../../styles/components/spaces/spaces.js";

const { React } = Uebersicht;

export const Component = React.memo(() => {
  const { spaces } = useAerospaceContext();
  const { displays, displayIndex, settings } = useSimpleBarContext();
  const { spacesDisplay, process } = settings;
  const { showOnDisplay } = spacesDisplay;
  const visible = Utils.isVisibleOnDisplay(displayIndex, showOnDisplay);
  const isProcessVisible = Utils.isVisibleOnDisplay(
    displayIndex,
    process.showOnDisplay
  );

  if (!visible) return null;

  if (!spaces?.length) {
    return <div className="spaces spaces--empty" />;
  }

  const sortedDisplays = displays.sort(
    (a, b) => parseInt(b["monitor-id"], 10) - parseInt(a["monitor-id"], 10)
  );

  return sortedDisplays.map((display) => {
    const displayId = display["monitor-id"];

    return (
      <div key={displayId} className="spaces">
        {spaces.map((space, i) => {
          const { workspace } = space;
          const lastOfSpace =
            i !== 0 && space.display !== spaces[i - 1].display;

          return (
            <Space
              key={workspace}
              display={displayId}
              space={space}
              lastOfSpace={lastOfSpace}
            />
          );
        })}
        {isProcessVisible && <div className="spaces__end-separator" />}
      </div>
    );
  });
});

Component.displayName = "Spaces";
