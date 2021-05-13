import { React } from 'uebersicht'

import DataWidget from './data-widget.jsx'
import Specter from './specter.jsx'
import { GoogleChromeIcon, SafariIcon, PlayingIcon, FirefoxIcon, DefaultIcon } from '../icons.jsx'

import { getSettings } from '../../settings'

export { browserTrackStyles } from '../../styles/components/data/browser-track'

const { useRef } = React

const getIcon = (browser) => {
  if (browser === 'chrome') return GoogleChromeIcon
  if (browser === 'safari') return SafariIcon
  if (browser === 'firefox') return FirefoxIcon
  return DefaultIcon
}

const BrowserTrack = ({ output }) => {
  const ref = useRef()
  const settings = getSettings()
  const { widgets, browserTrackWidgetOptions } = settings
  const { browserTrackWidget } = widgets
  if (!browserTrackWidget || !output) return null

  const { browser, title, spotifyStatus } = output
  const { showSpecter } = browserTrackWidgetOptions
  if (!browser || !title || browser === '' || title === '' || spotifyStatus === 'true') return null

  const onMouseEnter = () => {
    const target = ref.current
    if (!target) return
    const inner = target.querySelector('.browser-track__inner')
    const slider = target.querySelector('.browser-track__slider')
    const delta = inner.clientWidth - slider.clientWidth
    if (delta > 0) return
    const timing = Math.round((Math.abs(delta) * 100) / 4)
    Object.assign(slider.style, {
      transform: `translateX(${delta}px)`,
      transition: `transform ${timing}ms linear`
    })
  }
  const onMouseLeave = () => {
    const target = ref.current
    target && target.querySelector('.browser-track__slider').removeAttribute('style')
  }

  const Icon = () => {
    const BrowserIcon = getIcon(browser)
    return (
      <div className="browser-track__icons">
        <BrowserIcon />
        <PlayingIcon />
      </div>
    )
  }

  return (
    <DataWidget ref={ref} classes="browser-track" Icon={Icon} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {showSpecter && <Specter />}
      <div className="browser-track__inner">
        <div className="browser-track__slider">{title}</div>
      </div>
    </DataWidget>
  )
}

export default BrowserTrack
