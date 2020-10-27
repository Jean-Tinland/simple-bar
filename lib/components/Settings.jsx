import { React } from 'uebersicht'
import { classnames } from '../utils.js'
import { CloseIcon } from './Icons.jsx'

import { getSettings, setSettings, settingsData } from '../settings.js'

const { useState, useEffect, useCallback } = React

const Item = ({ code, defaultValue, label, type, options, placeholder, onChange }) => {
  if (type === 'radio') {
    return options.map((option) => {
      return (
        <div className="settings__item-option" key={option}>
          <input name={code} id={option} value={option} type="radio" defaultChecked={option === defaultValue} />
          <label htmlFor={option}>
            {option} {label}
          </label>
        </div>
      )
    })
  }
  if (type === 'text') {
    return (
      <>
        <label htmlFor={code}>{label}</label>
        <input id={code} type="text" defaultValue={defaultValue} placeholder={placeholder} onBlur={onChange} />
      </>
    )
  }
  return (
    <>
      <input id={code} type="checkbox" defaultChecked={defaultValue} onChange={onChange} />
      <label htmlFor={code}>{label}</label>
    </>
  )
}

const Settings = () => {
  const [visible, setVisible] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const settings = getSettings()

  const closeSettings = () => setVisible(false)

  const onKeydown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && (e.which === 188 || e.keyCode === 188)) {
      setVisible(true)
    }
  }, [])

  const onTabClick = (tab) => () => setCurrentTab(tab)

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
        <div className="settings__tabs">
          {Object.keys(settings).map((key, i) => {
            const { label } = settingsData[key]
            const classes = classnames('settings__tab', {
              'settings__tab--current': i === currentTab
            })
            return (
              <div key={i} className={classes} onClick={onTabClick(i)}>
                {label}
              </div>
            )
          })}
        </div>
        <div className="settings__inner">
          {Object.keys(settings).map((key) => {
            const { label, infos } = settingsData[key]
            return (
              <div key={key} className="settings__category" style={{ transform: `translateX(-${100 * currentTab}%)` }}>
                <div className="settings__inner-title">{label}</div>
                {Object.keys(settings[key]).map((subKey) => {
                  const { title, label, type, options, placeholder, fullWidth } = settingsData[subKey]
                  const defaultValue = settings[key][subKey]
                  const classes = classnames('settings__item', {
                    'settings__item--radio': type === 'radio',
                    'settings__item--text': type === 'text',
                    'settings__item--full-width': fullWidth
                  })
                  const onChange = (e) => {
                    const value = type === 'checkbox' ? e.target.checked : e.target.value
                    if (value !== defaultValue) {
                      setSettings(key, subKey, value)
                    }
                  }
                  return (
                    <>
                      {title && <div className="settings__item-title">{title}</div>}
                      <div key={subKey} className={classes} onChange={type === 'radio' ? onChange : undefined}>
                        <Item
                          code={subKey}
                          defaultValue={defaultValue}
                          type={type}
                          label={label}
                          options={options}
                          placeholder={placeholder}
                          onChange={onChange}
                        />
                      </div>
                    </>
                  )
                })}
                {infos && infos.length && (
                  <div className="settings__infos">
                    <div className="settings__infos-title">Tips</div>
                    {infos.map((info, i) => (
                      <div key={i} className="settings__info">
                        {info}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Settings
