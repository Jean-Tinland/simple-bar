import * as Uebersicht from 'uebersicht'
import OpenedApps from './opened-apps.jsx'
import SpaceOptions from './space-options.jsx'
import * as Utils from '../../utils'
import * as Yabai from '../../yabai'
import * as Settings from '../../settings'

const settings = Settings.get()

const Space = ({ space, display, windows, displayIndex, SIPDisabled, lastOfSpace }) => {
  const labelRef = Uebersicht.React.useRef()
  const [hovered, setHovered] = Uebersicht.React.useState(false)
  const [noDelay, setNoDelay] = Uebersicht.React.useState(false)
  const [editable, setEditable] = Uebersicht.React.useState(false)
  const { index, label, focused, visible, 'native-fullscreen': fullscreen, type } = space
  const [spaceLabel, setSpaceLabel] = Uebersicht.React.useState(label?.length ? label : index)

  const { spacesDisplay } = settings
  const {
    displayAllSpacesOnAllScreens,
    exclusionsAsRegex,
    displayStickyWindowsSeparately,
    hideDuplicateAppsInSpaces,
    showOptionsOnHover
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
    } else {
      if (focused === 1) return
      Yabai.goToSpace(index)
      Utils.clickEffect(e)
    }
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

  const { nonStickyWindows: apps, stickyWindows } = Utils.stickyWindowWorkaround(
    windows,
    hideDuplicateAppsInSpaces,
    display,
    index,
    exclusions,
    titleExclusions,
    exclusionsAsRegex
  )
  const allApps = [...apps, ...stickyWindows]

  if (!focused && !visible && !allApps.length && spacesDisplay.hideEmptySpaces) return null

  const classes = Utils.classnames(`space space--${type}`, {
    'space--focused': focused === 1,
    'space--visible': visible === 1,
    'space--fullscreen': fullscreen === 1,
    'space--hovered': hovered,
    'space--no-delay': noDelay,
    'space--empty': allApps.length,
    'space--editable': editable
  })

  const labelSize = typeof spaceLabel === 'number' ? spaceLabel.toString().length : spaceLabel.length

  return (
    <Uebersicht.React.Fragment>
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && <div className="spaces__separator" />}
      <div className={classes} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
        <button className="space__inner" onClick={onClick} onContextMenu={onRightClick}>
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
        {SIPDisabled && <SpaceOptions index={index} setHovered={setHovered} displayIndex={displayIndex} />}
      </div>
    </Uebersicht.React.Fragment>
  )
}

export default Space
