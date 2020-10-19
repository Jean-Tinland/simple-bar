import { React } from 'uebersicht'
import { classnames } from '../utils.js'
import { CloseIcon } from './Icons.jsx'

import { getSettings, setSettings, settingsLabels } from '../settings.js'

const { useState, useEffect, useCallback } = React

const Settings = () => {
  const [visible, setVisible] = useState(false)
  const settings = getSettings()

  const closeSettings = () => setVisible(false)

  const onKeydown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && (e.which === 188 || e.keyCode === 188)) {
      setVisible(true)
    }
  }, [])

  const onThemeChange = (e) => setSettings('global', 'theme', e.target.value)

  const onExclusionsChange = (e) => setSettings('spacesDisplay', 'exclusions', e.target.value)

  useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])

  const classes = classnames('settings', {
    'settings--visible': visible
  })

  return (
    <div className={classes}>
      <div className="settings__overlay" onClick={closeSettings} />
      <div className="settings__outer">
        <div className="settings__header">
          Settings
          <CloseIcon className="settings__close" onClick={closeSettings} />
        </div>
        <div className="settings__inner">
          <div className="settings__inner-title">Global</div>
          <div className="settings__items">
            {Object.keys(settings.global).map((key) => {
              if (key === 'theme') return null
              const setting = settings.global[key]
              const onGlobalChange = (e) => setSettings('global', key, e.target.checked)
              return (
                <div key={key} className="settings__item">
                  <input id={key} type="checkbox" defaultChecked={setting} onChange={onGlobalChange} />
                  <label htmlFor={key}>{settingsLabels[key]}</label>
                </div>
              )
            })}
          </div>
          <div className="settings__tips">
            "No bar background" is visually better with the "Floating bar" option activated
          </div>
          <div className="settings__inner-title">Spaces Display</div>
          <div className="settings__items">
            <div className="settings__item settings__item--text-input">
              <label htmlFor="exclusions">Exclusions</label>
              <input
                id="exclusions"
                name="exclusions"
                type="text"
                defaultValue={settings.spacesDisplay.exclusions}
                placeholder="example: Finder, iTerm2"
                onChange={onExclusionsChange}
              />
            </div>
          </div>
          <div className="settings__tips">Each exclusion must be separated by a comma and a space ", "</div>
          <div className="settings__inner-title">Widgets</div>
          <div className="settings__items">
            {Object.keys(settings.widgets).map((key) => {
              const setting = settings.widgets[key]
              const onWidgetChange = (e) => setSettings('widgets', key, e.target.checked)
              return (
                <div key={key} className="settings__item">
                  <input id={key} type="checkbox" defaultChecked={setting} onChange={onWidgetChange} />
                  <label htmlFor={key}>{settingsLabels[key]}</label>
                </div>
              )
            })}
          </div>
          <div className="settings__inner-title">Theme</div>
          <div className="settings__items" onChange={onThemeChange}>
            <div className="settings__item">
              <input
                name="theme"
                id="auto"
                value="auto"
                type="radio"
                defaultChecked={settings.global.theme === 'auto'}
              />
              <label htmlFor="auto">Auto (system)</label>
            </div>
            <div className="settings__item">
              <input
                name="theme"
                id="dark"
                value="dark"
                type="radio"
                defaultChecked={settings.global.theme === 'dark'}
              />
              <label htmlFor="dark">Dark</label>
            </div>
            <div className="settings__item">
              <input
                name="theme"
                id="light"
                value="light"
                type="radio"
                defaultChecked={settings.global.theme === 'light'}
              />
              <label htmlFor="light">Light</label>
            </div>
          </div>
          <div className="settings__inner-title">Time</div>
          <div className="settings__items">
            {Object.keys(settings.timeWidgetOptions).map((key) => {
              const setting = settings.timeWidgetOptions[key]
              const onTimeWidgetOptionsChange = (e) => setSettings('timeWidgetOptions', key, e.target.checked)
              return (
                <div key={key} className="settings__item">
                  <input id={key} type="checkbox" defaultChecked={setting} onChange={onTimeWidgetOptionsChange} />
                  <label htmlFor={key}>{settingsLabels[key]}</label>
                </div>
              )
            })}
          </div>
          <div className="settings__inner-title">Date</div>
          <div className="settings__items">
            {Object.keys(settings.dateWidgetOptions).map((key) => {
              const setting = settings.dateWidgetOptions[key]
              const isCheckbox = typeof setting !== 'string'
              const onDateWidgetOptionsChange = (e) => {
                const value = isCheckbox ? e.target.checked : e.target.value
                setSettings('dateWidgetOptions', key, value)
              }
              if (!isCheckbox) {
                return (
                  <div key={key} className="settings__item settings__item--text-input">
                    <label htmlFor={key}>{settingsLabels[key]}</label>
                    <input id={key} type="text" defaultValue={setting} onChange={onDateWidgetOptionsChange} />
                  </div>
                )
              }
              return (
                <div key={key} className="settings__item">
                  <input id={key} type="checkbox" defaultChecked={setting} onChange={onDateWidgetOptionsChange} />
                  <label htmlFor={key}>{settingsLabels[key]}</label>
                </div>
              )
            })}
          </div>
          <div className="settings__inner-title">{settingsLabels.showSpecter}</div>
          <div className="settings__items">
            {Object.keys(settings.spotifyWidgetOptions).map((key) => {
              const setting = settings.spotifyWidgetOptions[key]
              const onSpotifyWidgetOptionsChange = (e) => {
                setSettings('spotifyWidgetOptions', key, e.target.checked)
              }
              const code = `spotifyWidgetOptions-${key}`
              return (
                <div key={code} className="settings__item">
                  <input id={code} type="checkbox" defaultChecked={setting} onChange={onSpotifyWidgetOptionsChange} />
                  <label htmlFor={code}>Spotify</label>
                </div>
              )
            })}
            {Object.keys(settings.musicWidgetOptions).map((key) => {
              const setting = settings.musicWidgetOptions[key]
              const onMusicWidgetOptionsChange = (e) => {
                setSettings('musicWidgetOptions', key, e.target.checked)
              }
              const code = `musicWidgetOptions-${key}`
              return (
                <div key={code} className="settings__item">
                  <input id={code} type="checkbox" defaultChecked={setting} onChange={onMusicWidgetOptionsChange} />
                  <label htmlFor={code}>Music/Itunes</label>
                </div>
              )
            })}
            {Object.keys(settings.browserTrackWidgetOptions).map((key) => {
              const setting = settings.browserTrackWidgetOptions[key]
              const onBrowserTrackWidgetOptionsChange = (e) => {
                setSettings('browserTrackWidgetOptions', key, e.target.checked)
              }
              const code = `browserTrackWidgetOptions-${key}`
              return (
                <div key={code} className="settings__item">
                  <input
                    id={code}
                    type="checkbox"
                    defaultChecked={setting}
                    onChange={onBrowserTrackWidgetOptionsChange}
                  />
                  <label htmlFor={code}>Browser</label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
