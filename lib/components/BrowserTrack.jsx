import { React } from 'uebersicht'

import Specter from './Specter.jsx'
import { GoogleChromeIcon, SafariIcon, PlayingIcon, FirefoxIcon, DefaultIcon, MicrosoftEdgeIcon } from './Icons.jsx'

import { getSettings } from '../settings.js'

const { useRef } = React

const getIcon = (browser) => {
  if (browser === 'chrome') return GoogleChromeIcon
  if (browser === 'safari') return SafariIcon
  if (browser === 'firefox') return FirefoxIcon
  if (browser === 'edge') return MicrosoftEdgeIcon
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

  const Icon = getIcon(browser)

  return (
    <div ref={ref} className="browser-track" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="browser-track__icons">
        <Icon />
        <PlayingIcon />
      </div>
      {showSpecter && <Specter />}
      <div className="browser-track__inner">
        <div className="browser-track__slider">{title}</div>
      </div>
    </div>
  )
}

export default BrowserTrack
