import * as Uebersicht from "uebersicht";
import OpenedApps from "./opened-apps.jsx";
import SpaceOptions from "./space-options.jsx";
import { useYabaiContext } from "../yabai-context.jsx";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";
import * as Yabai from "../../yabai";

const { React } = Uebersicht;

export default function Space({
  space,
  display,
  currentSpaceIndex,
  lastOfSpace,
}) {
  const { windows } = useYabaiContext();
  const { SIPDisabled, settings } = useSimpleBarContext();
  const { spacesDisplay } = settings;
  const {
    displayAllSpacesOnAllScreens,
    exclusionsAsRegex,
    displayStickyWindowsSeparately,
    hideDuplicateAppsInSpaces,
    showOptionsOnHover,
  } = spacesDisplay;

  const labelRef = React.useRef();
  const [hovered, setHovered] = React.useState(false);
  const [noDelay, setNoDelay] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const {
    index,
    label,
    "has-focus": hasFocus,
    focused: __legacyHasFocus,
    "is-visible": isVisible,
    visible: __legacyIsVisible,
    "is-native-fullscreen": isNativeFullscreen,
    "native-fullscreen": __legacyIsNativeFullscreen,
    type,
  } = space;
  const [spaceLabel, setSpaceLabel] = React.useState(
    label?.length ? label : index
  );

  if (!displayAllSpacesOnAllScreens && display !== space.display) return null;

  const exclusions = exclusionsAsRegex
    ? spacesDisplay.exclusions
    : spacesDisplay.exclusions.split(", ");
  const titleExclusions = exclusionsAsRegex
    ? spacesDisplay.titleExclusions
    : spacesDisplay.titleExclusions.split(", ");

  const onMouseEnter = (e) => {
    if (!showOptionsOnHover) return;
    const { altKey, metaKey } = e;
    if (altKey) return;
    setHovered(true);
    if (metaKey) setNoDelay(true);
  };
  const onMouseLeave = () => {
    setHovered(false);
    setNoDelay(false);
    setEditable(false);
    window.getSelection().removeAllRanges();
  };
  const onClick = (e) => {
    onMouseLeave(e);
    if (e.altKey) {
      setEditable(true);
      labelRef.current?.select();
      return;
    }
    if (hasFocus || __legacyHasFocus) return;
    if (SIPDisabled && !spacesDisplay.switchSpacesWithoutYabai) {
      Yabai.goToSpace(index);
      Utils.clickEffect(e);
      return;
    }
    Utils.switchSpace(currentSpaceIndex, index);
    Utils.clickEffect(e);
  };
  const onRightClick = () => {
    setHovered(true);
    setNoDelay(true);
  };
  const onChange = (e) => {
    if (!editable) return;
    const newLabel = e.target.value;
    setSpaceLabel(newLabel);
    Yabai.renameSpace(index, newLabel);
  };

  const { nonStickyWindows: apps, stickyWindows } =
    Utils.stickyWindowWorkaround({
      windows,
      uniqueApps: hideDuplicateAppsInSpaces,
      currentDisplay: display,
      currentSpace: index,
      exclusions,
      titleExclusions,
      exclusionsAsRegex,
    });
  const allApps = [...apps, ...stickyWindows];

  const hidden =
    !(hasFocus ?? __legacyHasFocus) &&
    !(isVisible ?? __legacyHasFocus) &&
    !allApps.length &&
    spacesDisplay.hideEmptySpaces;

  if (hidden) return null;

  const classes = Utils.classNames(`space space--${type}`, {
    "space--focused": hasFocus ?? __legacyHasFocus,
    "space--visible": isVisible ?? __legacyIsVisible,
    "space--fullscreen": isNativeFullscreen ?? __legacyIsNativeFullscreen,
    "space--hovered": hovered,
    "space--no-delay": noDelay,
    "space--empty": allApps.length,
    "space--editable": editable,
  });

  const labelSize = (
    typeof spaceLabel === "number" ? spaceLabel.toString() : spaceLabel
  ).length;

  return (
    <React.Fragment>
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && (
        <div className="spaces__separator" />
      )}
      <div
        className={classes}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <button
          className="space__inner"
          onClick={onClick}
          onContextMenu={onRightClick}
        >
          <input
            ref={labelRef}
            type="text"
            className="space__label"
            onChange={onChange}
            value={spaceLabel}
            style={{ width: `${labelSize}ch` }}
            readOnly={!editable}
          />
          <OpenedApps apps={displayStickyWindowsSeparately ? apps : allApps} />
        </button>
        {SIPDisabled && <SpaceOptions index={index} setHovered={setHovered} />}
      </div>
    </React.Fragment>
  );
}
