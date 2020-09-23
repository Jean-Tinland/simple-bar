import Specter from './Specter.jsx'
import { GoogleChromeIcon, PlayingIcon } from './Icons.jsx'

const ChromeTrack = ({ output, spotifyStatus }) => {
  if (!output || output === '' || spotifyStatus === 'true') return null

  const onMouseEnter = (e) => {
    const target = e.target.closest('.chrome-track')
    if (!target) return
    const inner = target.querySelector('.chrome-track__inner')
    const slider = target.querySelector('.chrome-track__slider')
    const delta = inner.clientWidth - slider.clientWidth
    if (delta > 0) return
    const timing = Math.round((Math.abs(delta) * 100) / 4)
    Object.assign(slider.style, {
      transform: `translateX(${delta}px)`,
      transition: `transform ${timing}ms linear`
    })
  }
  const onMouseLeave = (e) => {
    const target = e.target.closest('.chrome-track')
    target && target.querySelector('.chrome-track__slider').removeAttribute('style')
  }

  return (
    <div className="chrome-track" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="chrome-track__icons">
        <GoogleChromeIcon />
        <PlayingIcon />
      </div>
      <Specter />
      <div className="chrome-track__inner">
        <div className="chrome-track__slider">{output}</div>
      </div>
    </div>
  )
}

export default ChromeTrack
