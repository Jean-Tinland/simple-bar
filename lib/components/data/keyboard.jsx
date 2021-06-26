import { run, React } from 'uebersicht'
import DataWidget from './data-widget.jsx'
import DataWidgetLoader from './data-widget-loader.jsx'
import { KeyboardIcon } from '../icons.jsx'
import { getSettings } from '../../settings'
import { cleanupOutput } from '../../utils.js'
import { useWidgetRefresh } from '../../hooks/use-widget-refresh.js'

export { keyboardStyles } from '../../styles/components/data/keyboard'

const { useState } = React

const refreshFrequency = 20000

const settings = getSettings()

const Keyboard = () => {
  const { keyboardWidget } = settings.widgets

  const [state, setState] = useState()
  const [loading, setLoading] = useState(keyboardWidget)

  const getKeyboard = async () => {
    const keyboard = await run(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | egrep -w 'KeyboardLayout Name' | sed 's/"//g' | sed 's/KeyboardLayout Name = //g'`
    )
    setState({ keyboard: cleanupOutput(keyboard) })
    setLoading(false)
  }

  useWidgetRefresh(keyboardWidget, getKeyboard, refreshFrequency)

  if (loading) return <DataWidgetLoader className="keyboard" />
  if (!state) return null
  const { keyboard } = state

  if (!keyboard?.length) return null

  const formatedOutput = keyboard.replace("'KeyboardLayout Name' =", '').replace(';', '')

  return (
    <DataWidget classes="keyboard" Icon={KeyboardIcon}>
      {formatedOutput}
    </DataWidget>
  )
}

export default Keyboard
