import Space from './space.jsx'
import * as Icons from '../icons.jsx'
import * as Utils from '../../utils'
import * as Yabai from '../../yabai'

export { spacesStyles as styles } from '../../styles/components/spaces/spaces'

export const Component = ({ output, SIP, displayIndex }) => {
  if (!output) return <div className="spaces-display spaces-display--empty" />
  const { spaces, windows } = output

  const displays = [...new Set(spaces.map((space) => space.display))]
  const SIPDisabled = SIP !== 'System Integrity Protection status: enabled.'
  return displays.map((display, i) => {
    if (display !== displayIndex) return null
    const onClick = async (e) => {
      Utils.clickEffect(e)
      await Yabai.createSpace(displayIndex)
    }
    return (
      <div key={i} className="spaces">
        {spaces.map((space, i) => {
          const { label, index } = space
          const lastOfSpace = i !== 0 && space.display !== spaces[i - 1].display
          return (
            <Space
              key={label?.length ? label : index}
              display={display}
              space={space}
              windows={windows}
              displayIndex={displayIndex}
              SIPDisabled={SIPDisabled}
              lastOfSpace={lastOfSpace}
            />
          )
        })}
        {SIPDisabled && (
          <button className="spaces__add" onClick={onClick}>
            <Icons.AddIcon />
          </button>
        )}
      </div>
    )
  })
}
