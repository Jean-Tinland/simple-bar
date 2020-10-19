import Space from './Space.jsx'
import { AddIcon } from './Icons.jsx'

import { clickEffect } from '../utils.js'
import { createSpace } from '../yabai.js'

export const refreshFrequency = false

const Spaces = ({ output, SIP, displayId }) => {
  if (!output) return <div className="spaces-display spaces-display--empty" />
  const { spaces, windows } = output

  const displays = [...new Set(spaces.map((space) => space.display))]
  const SIPDisabled = SIP !== 'System Integrity Protection status: enabled.'

  return displays.map((display, i) => {
    if (display !== displayId) return null
    const onClick = (e) => {
      clickEffect(e)
      createSpace(displayId)
    }
    return (
      <div key={i} className="spaces">
        {spaces.map((space, i) => (
          <Space
            key={i}
            display={display}
            space={space}
            windows={windows}
            displayId={displayId}
            SIPDisabled={SIPDisabled}
          />
        ))}
        {SIPDisabled && (
          <div className="spaces__add" onClick={onClick}>
            <AddIcon />
          </div>
        )}
      </div>
    )
  })
}

export default Spaces
