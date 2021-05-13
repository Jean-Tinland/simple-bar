import DataWidget from './data-widget.jsx'
import { KeyboardIcon } from '../icons.jsx'

import { getSettings } from '../../settings'

export { keyboardStyles } from '../../styles/components/data/keyboard'

const Keyboard = ({ output }) => {
  const settings = getSettings()
  const { keyboardWidget } = settings.widgets
  if (!keyboardWidget || !output || !output.layout || output.layout === '') return null

  const formatedOutput = output && output.layout.replace("'KeyboardLayout Name' =", '').replace(';', '')

  return (
    <DataWidget classes="keyboard" Icon={KeyboardIcon}>
      {formatedOutput}
    </DataWidget>
  )
}

export default Keyboard
