export const SettingsStyles = /* css */ `
.settings {
  z-index: 0;
}
.settings--visible .settings__overlay {
  position: fixed;
  top: 28px;
  left: 0;
  width: 100%;
  height: calc(100% - 28px);
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  z-index: 0;
}
.settings__outer {
  position: fixed;
  left: calc(50% - 250px);
  top: 38px;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  background-color: var(--main);
  border-radius: 4px;
  box-shadow: var(--light-shadow);
  opacity: 0;
  transform: translate(0, -50px) scale(0.8);
  pointer-events: none;
  touch-action: none;
  transition: opacity 160ms var(--transition-easing), transform 160ms var(--transition-easing);
  z-index: 1;
}
.settings--visible .settings__outer {
  pointer-events: auto;
  touch-action: auto;
  opacity: 1;
  transform: none;
}
.settings__header {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
}
.settings__close {
  width: 10px;
  height: 10px;
  margin-left: auto;
  cursor: pointer;
  user-select: none;
  fill: white;
}
.settings__tabs {
  display: flex;
  flex-wrap: wrap;
  margin-bottom 20px;
}
.settings__tab {
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  transition: color 160ms var(--transition-easing), background-color 160ms var(--transition-easing);
}
.settings__tab:not(:last-of-type) {
  margin-right: 10px;
}
.settings__tab:not(.settings__tab--current):hover {
  background-color: var(--minor);
}
.settings__tab--current {
  color: var(--main);
  background-color: #fff;
}
.settings__inner {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow: hidden;
}
.settings__category {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  transition: transform 160ms var(--transition-easing);
}
.settings__inner-title {
  flex: 0 0 100%;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
}
.settings__item-title {
  flex: 0 0 100%;
  margin: 8px 0;
  font-weight: 700;
}
.settings__item,
.settings__item-option {
  flex: 0 0 33.33%;
  margin-bottom: 5px;
}
.settings__item--full-width {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
}
.settings__item--radio {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
}
.settings__item > label,
.settings__item-option > label {
  margin-left: 8px;
}
.settings__item--text > label {
  margin-left: 0;
  margin-right: 8px;
}
.settings__item--full-width.settings__item--text > label {
  flex: 1 1 auto;
  white-space: nowrap;
}
.settings__item--text > input {
  width: auto;
  padding: 1px 4px;
  font-size: 10px;
  box-sizing: border-box;
  border: 0;
  border-radius: 4px;
}
.settings__item--full-width.settings__item--text > input {
  flex: 1 1 100%;
}
.settings__item--text > input:focus {
  outline: none;
}
.settings__infos {
  width: 100%;
  margin-top: 5px;
  padding: 10px;
  background-color: var(--minor);
  border-radius: 5px;
}
.settings__infos-title {
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 700;
}
.settings__info {
  font-style: italic;
}
`
