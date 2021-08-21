import * as Uebersicht from 'uebersicht'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

export { settingsStyles as styles } from '../../styles/components/settings/settings'

const EXTERNAL_CONFIG_FILE_PATH = `~/.simplebarrc`

const Item = ({ code, Component, defaultValue, label, type, options, placeholder, minHeight, onChange }) => {
  const onClick = (e) => Utils.clickEffect(e)
  if (type === 'component') {
    return <Component defaultValue={defaultValue} onChange={onChange} />
  }
  if (type === 'select') {
    return (
      <Uebersicht.React.Fragment>
        <label htmlFor={code}>{label}</label>
        <select id={code} className="settings__select" onChange={onChange} defaultValue={defaultValue}>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </Uebersicht.React.Fragment>
    )
  }
  if (type === 'radio') {
    return options.map((option) => (
      <div className="settings__item-option" key={option} onClick={onClick}>
        <input name={code} id={option} value={option} type="radio" defaultChecked={option === defaultValue} />
        <label htmlFor={option}>
          {option} {label}
        </label>
      </div>
    ))
  }
  if (type === 'text') {
    return (
      <Uebersicht.React.Fragment>
        <label htmlFor={code}>{label}</label>
        <input
          id={code}
          type="text"
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </Uebersicht.React.Fragment>
    )
  }
  if (type === 'textarea') {
    return (
      <Uebersicht.React.Fragment>
        <label htmlFor={code}>{label}</label>
        <textarea
          id={code}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{ minHeight }}
        />
      </Uebersicht.React.Fragment>
    )
  }
  return (
    <Uebersicht.React.Fragment>
      <input id={code} type="checkbox" defaultChecked={defaultValue} onChange={onChange} onClick={onClick} />
      <label htmlFor={code} onClick={onClick}>
        {label}
      </label>
    </Uebersicht.React.Fragment>
  )
}

const LAST_CURRENT_TAB = 'simple-bar-last-current-settings-tab'

const getLastCurrentTab = () => {
  const storedLastCurrentTab = window.sessionStorage.getItem(LAST_CURRENT_TAB)
  if (storedLastCurrentTab) return parseInt(storedLastCurrentTab)
  return 0
}

export const Component = () => {
  const [visible, setVisible] = Uebersicht.React.useState(false)
  const [currentTab, setCurrentTab] = Uebersicht.React.useState(getLastCurrentTab())
  const [pendingChanges, setPendingChanges] = Uebersicht.React.useState(0)
  const settings = Settings.get()
  const [newSettings, setNewSettings] = Uebersicht.React.useState(settings)

  const closeSettings = () => setVisible(false)

  const onKeydown = Uebersicht.React.useCallback((e) => {
    const { ctrlKey, keyCode, metaKey, which } = e
    if ((ctrlKey || metaKey) && (which === 84 || keyCode === 84)) {
      e.preventDefault()
      const AUTO = 'auto'
      const DARK = 'dark'
      const LIGHT = 'light'
      const newValue = newSettings.global.theme === AUTO ? AUTO : newSettings.global.theme === LIGHT ? DARK : LIGHT
      Uebersicht.run(
        `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'`
      )
      if (newValue !== AUTO) {
        const updatedSettings = { ...newSettings, global: { ...newSettings.global, theme: newValue } }
        Settings.set(updatedSettings)
        Utils.hardRefresh()
      }
    }
    if ((ctrlKey || metaKey) && (which === 188 || keyCode === 188)) {
      e.preventDefault()
      setVisible(true)
    }
  }, [])

  const onTabClick = (tab) => {
    setCurrentTab(tab)
    window.sessionStorage.setItem(LAST_CURRENT_TAB, tab)
  }

  const onRefreshClick = async (e) => {
    Utils.clickEffect(e)
    setPendingChanges(0)
    await Settings.set(newSettings)
    Utils.hardRefresh()
  }

  const onImportClick = async () => {
    let fileExists = false
    try {
      fileExists = Boolean(await Uebersicht.run(`ls ${EXTERNAL_CONFIG_FILE_PATH}`))
    } catch (e) {}
    if (!fileExists) return
    const externalConfig = JSON.parse(await Uebersicht.run(`cat ${EXTERNAL_CONFIG_FILE_PATH}`))
    setNewSettings(externalConfig)
  }

  const onExportClick = async () => {
    const { externalConfigFile } = newSettings.global
    if (externalConfigFile) {
      await Uebersicht.run(`echo '${JSON.stringify(newSettings)}' | tee ${EXTERNAL_CONFIG_FILE_PATH}`)
    }
  }

  Uebersicht.React.useEffect(() => {
    const diffs = Utils.compareObjects(Settings.get(), newSettings)
    const deepDiffs = Object.keys(diffs).reduce((acc, key) => [...acc, ...Object.keys(diffs[key])], [])
    setPendingChanges(deepDiffs.length)
  }, [newSettings])

  Uebersicht.React.useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])

  const classes = Utils.classnames('settings', { 'settings--visible': visible })

  return (
    <div className={classes}>
      <div className="settings__overlay" onClick={closeSettings} />
      <div className="settings__outer">
        <div className="settings__header">
          <button className="settings__header-dot settings__header-dot--close" onClick={closeSettings} />
          <span className="settings__header-dot settings__header-dot--disabled" />
          <span className="settings__header-dot settings__header-dot--disabled" />
          Settings
        </div>
        <div className="settings__tabs">
          {Object.keys(Settings.defaultSettings).map((key, i) => {
            const setting = Settings.data[key]
            if (!setting) return null
            const { label } = setting
            const classes = Utils.classnames('settings__tab', {
              'settings__tab--current': i === currentTab
            })
            return (
              <button key={i} className={classes} onClick={() => onTabClick(i)}>
                {label}
              </button>
            )
          })}
        </div>
        <div className="settings__inner">
          {Object.keys(Settings.defaultSettings).map((key) => {
            const setting = Settings.data[key]
            if (!setting) return null
            const { label, infos } = setting
            return (
              <div key={key} className="settings__category" style={{ transform: `translateX(-${100 * currentTab}%)` }}>
                <div className="settings__inner-title">{label}</div>
                {Object.keys(Settings.defaultSettings[key]).map((subKey) => {
                  const subSetting = Settings.data[subKey]
                  if (!subSetting) return null
                  const { Component, fullWidth, label, options, placeholder, title, type, minHeight } = subSetting
                  const defaultValue = newSettings[key][subKey]
                  const classes = Utils.classnames('settings__item', {
                    'settings__item--radio': type === 'radio',
                    'settings__item--text': type === 'text',
                    'settings__item--textarea': type === 'textarea',
                    'settings__item--full-width': fullWidth
                  })
                  const onChange = (e) => {
                    const value = type === 'checkbox' ? e.target.checked : e.target.value
                    const updatedSettings = { ...newSettings, [key]: { ...newSettings[key], [subKey]: value } }
                    setNewSettings(updatedSettings)
                  }

                  return (
                    <Uebersicht.React.Fragment key={subKey}>
                      {title && <div className="settings__item-title">{title}</div>}
                      <div key={subKey} className={classes} onChange={type === 'radio' ? onChange : undefined}>
                        <Item
                          code={subKey}
                          Component={Component}
                          defaultValue={defaultValue}
                          label={label}
                          onChange={onChange}
                          options={options}
                          placeholder={placeholder}
                          type={type}
                          minHeight={minHeight}
                        />
                      </div>
                    </Uebersicht.React.Fragment>
                  )
                })}
                {infos && infos.length && (
                  <div className="settings__infos">
                    <div className="settings__infos-title">Tips</div>
                    {infos.map((info, i) => (
                      <div key={i} className="settings__info" dangerouslySetInnerHTML={{ __html: info }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="settings__bottom">
          {settings.global.externalConfigFile && (
            <Uebersicht.React.Fragment>
              <button className="settings__import-button" onClick={onImportClick} disabled={!!pendingChanges}>
                Import
              </button>
              or
              <button className="settings__export-button" onClick={onExportClick} disabled={!!pendingChanges}>
                Export
              </button>
              <span className="settings__import-export-label">all settings</span>
            </Uebersicht.React.Fragment>
          )}
          {pendingChanges !== 0 && (
            <div className="settings__pending-changes">
              <b>{pendingChanges}</b> pending change{pendingChanges > 1 && 's'}
            </div>
          )}
          <button className="settings__refresh-button" onClick={onRefreshClick} disabled={!pendingChanges}>
            Refresh simple-bar
          </button>
        </div>
      </div>
    </div>
  )
}
