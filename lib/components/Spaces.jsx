import Space from './Space.jsx'
import { AddIcon } from './Icons.jsx'

import { clickEffect } from '../utils.js'
import { createSpace } from '../yabai.js'

export const refreshFrequency = false

const Spaces = ({ output, SIP, displayId }) => {
  const { displays, spaces, windows } = output
  let focusedSpace

  if (!output) return <div className="spaces-display spaces-display--empty" />

  const SIPDisabled = SIP !== 'System Integrity Protection status: enabled.'

  return displays.map((display, i) => {
    if (display.index !== displayId) return null
    const onClick = (e) => {
      clickEffect(e)
      createSpace(displayId)
    }
    return (
      <div key={i} className="spaces">
        {spaces.map((space, i) => (
          <Space
            key={i}
            space={space}
            display={display}
            windows={windows}
            SIPDisabled={SIPDisabled}
            focusedSpace={focusedSpace}
            displayId={displayId}
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
