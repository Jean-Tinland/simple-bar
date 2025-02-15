import * as Uebersicht from "uebersicht";
import Space from "./space.jsx";
import { useFlashspaceContext } from "../flashspace-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils.js";

export { spacesStyles as styles } from "../../styles/components/spaces/spaces.js";

const { React } = Uebersicht;

/**
 * Spaces component to display spaces on the screen.
 * @returns {JSX.Element|null} The rendered component.
 */
const Component = React.memo(() => {
  // Get spaces from flashspace context
  const { workspaces, currentWorkspace } = useFlashspaceContext();

  // Get displayIndex, and settings from simple bar context
  const { displayIndex, settings } = useSimpleBarContext();
  const { spacesDisplay } = settings;
  const { showOnDisplay } = spacesDisplay;

  // Determine if the component should be visible on the current display
  const visible = Utils.isVisibleOnDisplay(displayIndex, showOnDisplay);

  // If not visible, return null
  if (!visible) return null;

  // If there are no spaces, return an empty div
  if (!workspaces?.length) {
    return <div className="spaces spaces--empty" />;
  }

  // Map through and render workspaces
  return (
    <div className="spaces">
      {workspaces.map((workspace, i) => {
        return (
          <Space
            key={workspace.id}
            index={i + 1}
            workspace={workspace}
            currentWorkspace={currentWorkspace}
          />
        );
      })}
    </div>
  );
});

Component.displayName = "Spaces";

export default Component;
