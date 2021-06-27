import { React } from 'uebersicht'
import OpenedApps from './opened-apps.jsx'
import SpaceOptions from './space-options.jsx'
import { classnames, clickEffect, filterApps } from '../../utils'
import { goToSpace, renameSpace } from '../../yabai'
import { getSettings } from '../../settings'

const { useRef, useState } = React

const settings = getSettings()

const Space = ({ space, display, windows, displayIndex, SIPDisabled, lastOfSpace }) => {
  const labelRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [noDelay, setNoDelay] = useState(false)
  const [editable, setEditable] = useState(false)
  const { index, label, focused, visible, type } = space
  const [spaceLabel, setSpaceLabel] = useState(label?.length ? label : index)

  const { spacesDisplay } = settings
  const { displayAllSpacesOnAllScreens, exclusionsAsRegex } = spacesDisplay
  if (!displayAllSpacesOnAllScreens && display !== space.display) return null

  const exclusions = exclusionsAsRegex ? spacesDisplay.exclusions : spacesDisplay.exclusions.split(', ')
  const titleExclusions = exclusionsAsRegex ? spacesDisplay.titleExclusions : spacesDisplay.titleExclusions.split(', ')

  const onMouseEnter = (e) => {
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
    if (e.altKey) {
      setEditable(true)
      labelRef.current?.select()
    } else {
      if (focused === 1) return
      goToSpace(index)
      clickEffect(e)
    }
  }
  const onChange = (e) => {
    if (!editable) return
    const newLabel = e.target.value
    setSpaceLabel(newLabel)
    renameSpace(index, newLabel)
  }

  const apps = windows.filter(
    (app) => app.space === index && filterApps(app, exclusions, titleExclusions, exclusionsAsRegex)
  )

  if (!focused && !visible && apps.length === 0 && spacesDisplay.hideEmptySpaces) return null

  const classes = classnames(`space space--${type}`, {
    'space--focused': focused === 1,
    'space--visible': visible === 1,
    'space--hovered': hovered,
    'space--no-delay': noDelay,
    'space--empty': apps.length === 0,
    'space--editable': editable
  })

  const labelSize = typeof spaceLabel === 'number' ? spaceLabel.toString().length : spaceLabel.length

  return (
    <>
      {spacesDisplay.displayAllSpacesOnAllScreens && lastOfSpace && <div className="spaces__separator" />}
      <div className={classes} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <button className="space__inner" onClick={onClick}>
          <input
            ref={labelRef}
            type="text"
            className="space__label"
            onChange={onChange}
            value={spaceLabel}
            size={labelSize}
            readOnly={!editable}
          />
          <OpenedApps type={type} apps={apps} />
        </button>
        {!spacesDisplay.hideSpacesOptions && SIPDisabled && (
          <SpaceOptions index={index} setHovered={setHovered} displayIndex={displayIndex} />
        )}
      </div>
    </>
  )
}

export default Space
