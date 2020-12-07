import { KeyboardIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

const Keyboard = ({ output }) => {
  const settings = getSettings()
  const { keyboardWidget } = settings.widgets
  if (!keyboardWidget || !output || !output.layout || output.layout === '') return null

  const formatedOutput = output && output.layout.replace("'KeyboardLayout Name' =", '').replace(';', '')

  return (
    <div className="keyboard">
      <KeyboardIcon className="keyboard__icon" />
      {formatedOutput}
    </div>
  )
}

export default Keyboard
