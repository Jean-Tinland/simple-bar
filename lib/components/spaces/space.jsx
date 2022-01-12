import * as Uebersicht from 'uebersicht'
import OpenedApps from './opened-apps.jsx'
import SpaceOptions from './space-options.jsx'
import * as Utils from '../../utils'
import * as Yabai from '../../yabai'
import * as Settings from '../../settings'
import * as AppIcons from '../../app-icons'

const settings = Settings.get()

const Space = ({ space, display, windows, displayIndex, currentSpaceIndex, SIPDisabled, lastOfSpace }) => {
  const labelRef = Uebersicht.React.useRef()
  const [hovered, setHovered] = Uebersicht.React.useState(false)
  const [noDelay, setNoDelay] = Uebersicht.React.useState(false)
  const [editable, setEditable] = Uebersicht.React.useState(false)
  const {
    index,
    label,
    'has-focus': hasFocus,
    focused: __legacyHasFocus,
    'is-visible': isVisible,
    visible: __legacyIsVisible,
    'is-native-fullscreen': isNativeFullscreen,
    'native-fullscreen': __legacyIsNativeFullscreen,
    type
  } = space
  const [spaceLabel, setSpaceLabel] = Uebersicht.React.useState(label?.length ? label : index)

  const { spacesDisplay } = settings
  const {
    displayAllSpacesOnAllScreens,
    exclusionsAsRegex,
    displayStickyWindowsSeparately,
    hideDuplicateAppsInSpaces,
    showOptionsOnHover,
    hideSpaceLabelForNonEmpty,
    hideSticky
  } = spacesDisplay
  if (!displayAllSpacesOnAllScreens && display !== space.display) return null

  const exclusions = exclusionsAsRegex ? spacesDisplay.exclusions : spacesDisplay.exclusions.split(', ')
  const titleExclusions = exclusionsAsRegex ? spacesDisplay.titleExclusions : spacesDisplay.titleExclusions.split(', ')

  const onMouseEnter = (e) => {
    if (!showOptionsOnHover) return
    const { altKey, metaKey } = e
    if (altKey) return
    setHovered(true)
    if (metaKey) setNoDelay(true)
  }
  const onMouseLeave = () => {
    setHovered(false)
    setNoDelay(false)
    setEditable(false)
    window.getSelection().removeAllRanges()
  }
  const onClick = (e) => {
    onMouseLeave(e)
    if (e.altKey) {
      setEditable(true)
      labelRef.current?.select()
      return
    }
    if (hasFocus || __legacyHasFocus) return
    if (SIPDisabled && !spacesDisplay.switchSpacesWithoutYabai) {
      Yabai.goToSpace(index)
      return
    }
    Utils.switchSpace(currentSpaceIndex, index)
    Utils.clickEffect(e)
  }
  const onRightClick = (e) => {
    setHovered(true)
    setNoDelay(true)
  }
  const onChange = (e) => {
    if (!editable) return
    const newLabel = e.target.value
    setSpaceLabel(newLabel)
    Yabai.renameSpace(index, newLabel)
  }

  const { nonStickyWindows: apps, stickyWindows } = Utils.stickyWindowWorkaround({
    windows,
    uniqueApps: hideDuplicateAppsInSpaces,
    currentDisplay: display,
    currentSpace: index,
    exclusions,
    titleExclusions,
    exclusionsAsRegex
  })
  const allApps = [...apps, ...stickyWindows]

  if (
    !(hasFocus ?? __legacyHasFocus) &&
    !(isVisible ?? __legacyHasFocus) &&
    !allApps.length &&
    spacesDisplay.hideEmptySpaces
  )
    return null

  const classes = Utils.classnames(`space space--${type}`, {
    'space--focused': hasFocus ?? __legacyHasFocus,
    'space--visible': isVisible ?? __legacyIsVisible,
    'space--fullscreen': isNativeFullscreen ?? __legacyIsNativeFullscreen,
    'space--hovered': hovered,
    'space--no-delay': noDelay,
    'space--empty': allApps.length,
    'space--editable': editable
  })

const labelSize = (typeof spaceLabel === 'number' ? spaceLabel.toString() : spaceLabel).length
const spaceApps = displayStickyWindowsSeparately || hideSticky ? apps : allApps;

  return (
    <Uebersicht.React.Fragment>
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && <div className="spaces__separator" />}
      <div className={classes} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
        <button className="space__inner" onClick={onClick} onContextMenu={onRightClick}>
          {renderLabel(hideSpaceLabelForNonEmpty, spaceLabel, spaceApps)}
          <OpenedApps spaceLabel={hideSpaceLabelForNonEmpty ? spaceLabel : null} apps={spaceApps} />
        </button>
        {SIPDisabled && <SpaceOptions index={index} setHovered={setHovered} displayIndex={displayIndex} />}
      </div>
    </Uebersicht.React.Fragment>
  )
}

const renderLabel = (hideSpaceLabelForNonEmpty, spaceLabel, apps) => {
  if (hideSpaceLabelForNonEmpty && apps.length !== 0) {
    return null
  }
  
  if (typeof spaceLabel !== 'number') {
    return (<input
      ref={labelRef}
      type="text"
      className="space__label"
      onChange={onChange}
      value={spaceLabel}
      style={{ width: `${spaceLabel.length}ch` }}
      readOnly={!editable}
    />)
  } else {
    const labelString = spaceLabel.toString();
    const LabelIcon = AppIcons.apps[labelString] || AppIcons.apps.Empty
    if (!spaceLabel || labelString.length == 0) {
      return null
    }
      
    return <LabelIcon className="space__icon" /> 
  }
}

export default Space
