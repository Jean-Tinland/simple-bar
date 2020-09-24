import Specter from './Specter.jsx'
import { GoogleChromeIcon, SafariIcon, PlayingIcon, FirefoxIcon, DefaultIcon } from './Icons.jsx'

const getIcon = (browser) => {
  if (browser === 'chrome') return GoogleChromeIcon
  if (browser === 'safari') return SafariIcon
  if (browser === 'firefox') return FirefoxIcon
  return DefaultIcon
}

const BrowserTrack = ({ output, spotifyStatus }) => {
  if (!output || spotifyStatus === 'true') return null

  const { browser, title } = output
  if (browser === '' || title === '') return null

  const onMouseEnter = (e) => {
    const target = e.target.closest('.browser-track')
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
  const onMouseLeave = (e) => {
    const target = e.target.closest('.browser-track')
    target && target.querySelector('.browser-track__slider').removeAttribute('style')
  }

  const Icon = getIcon(browser)

  return (
    <div className="browser-track" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="browser-track__icons">
        <Icon />
        <PlayingIcon />
      </div>
      <Specter />
      <div className="browser-track__inner">
        <div className="browser-track__slider">{title}</div>
      </div>
    </div>
  )
}

export default BrowserTrack
