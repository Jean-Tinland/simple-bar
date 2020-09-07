import Space from './Space.jsx'
import { Add } from './Icons.jsx'

import { createSpace } from '../yabai'

export const refreshFrequency = false

const Spaces = ({ output, SIP, displayId }) => {
  const { displays, spaces, windows } = output
  const spacesLength = spaces.filter((space) => space.display === displayId).length
  let focusedSpace

  if (!output) return <div className="spaces-display spaces-display--empty" />

  const SIPDisabled = SIP === 'System Integrity Protection status: disabled.'

  return displays.map((display, i) => {
    if (display.index !== displayId) return null
    return (
      <div key={i} className="spaces">
        {spaces.map((space, i) => (
          <Space
            key={i}
            space={space}
            display={display}
            windows={windows}
            SIPDisabled={SIPDisabled}
            spacesLength={spacesLength}
            focusedSpace={focusedSpace}
          />
        ))}
        {SIPDisabled && (
          <div className="spaces__add" onClick={createSpace(spaces.length)}>
            <Add />
          </div>
        )}
      </div>
    )
  })
}

export default Spaces
