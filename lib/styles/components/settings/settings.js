// Styles for /lib/components/settings/settings.jsx component
import { userWidgetsCreatorStyles } from "./user-widgets-creator";
import { aerospaceDisplayManagerStyles } from "./aerospace-display-manager";

export const settingsStyles = /* css */ `
.settings {
  z-index: 1;
}
.settings__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.simple-bar--floating .settings__overlay,
.simple-bar--no-bar-background .settings__overlay {
  display: none;
}
.simple-bar--on-bottom  .settings__overlay {
  top: unset;
  bottom: 28px;
}
.settings__outer {
  --settings-width: 620px;
  position: fixed;
  left: calc(50% - (var(--settings-width) / 2));
  top: calc(var(--bar-height) + 10px);
  width: var(--settings-width);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  background-color: var(--main);
  border-radius: var(--item-radius);
  box-shadow: var(--light-shadow);
  z-index: 1;
}
.simple-bar--floating .settings__outer {
  top: calc(var(--bar-height) + 20px);
}
.simple-bar--on-bottom  .settings__outer {
  top: unset;
  bottom: calc(var(--bar-height) + 10px);
}
.settings__header {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  font-size: calc(var(--font-size) * 1.4);
  font-weight: 700;
}
.settings__header-dot {
  flex: 0 0 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 9px;
}
.settings__header-dot--close {
  padding: 0;
  background-color: var(--red);
  cursor: pointer;
  user-select: none;
  border: 0;
  -webkit-user-select: none;
}
.settings__header-dot--disabled {
  background-color: grey;
  opacity: 0.3;
}
.settings__tabs {
  width: fit-content;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px;
  background-color: var(--minor);
  border-radius: var(--item-radius);
}
.settings__tab {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 5px;
  font-family: var(--font);
  font-size: var(--font-size);
  color: var(--foreground);
  text-align: center;
  background-color: transparent;
  border-radius: var(--item-radius);
  border: 0;
  outline: none;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: color 160ms var(--transition-easing), background-color 160ms var(--transition-easing),
    box-shadow 160ms var(--transition-easing);
}
.settings__tab:hover {
  box-shadow: var(--hover-ring);
}
.settings__tab:active {
  box-shadow: var(--focus-ring);
}
.settings__tab--current {
  color: var(--background);
  background-color: var(--foreground);
}
.settings__inner {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow: clip;
}
.settings__category {
  flex: 0 0 100%;
  max-height: 70vh;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 10px 25px 0;
  box-sizing: border-box;
  overflow: auto;
  transition: transform 160ms var(--transition-easing);
}
.settings__category::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.settings__category::-webkit-scrollbar-track {
  background-color: var(--main-alt);
  opacity: 0.1;
  border-radius: var(--item-radius);
}
.settings__category::-webkit-scrollbar-thumb {
  background: var(--foreground);
  border-radius: var(--item-radius);
}
.settings__inner-title {
  flex: 0 0 100%;
  font-size: calc(var(--font-size) * 1.2);
  font-weight: 700;
}
.settings__item-title {
  flex: 0 0 100%;
  margin: 8px 0;
  font-weight: 700;
}
.settings__item,
.settings__item-option {
  position: relative;
  flex: 1 0 32%;
  display: flex;
  align-items: center;
  gap: 4px;
}
.settings__item--full-width {
  flex: 1 1 100%;
}
.settings__item--color {
  flex: 0 0 32%;
  flex-direction: column;
  align-items: stretch;
}
.settings__item--radio {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
}
.settings__item--textarea {
  flex-direction: column;
  align-items: stretch;
  padding: 5px;
}
.settings__item--color > label,
.settings__item--full-width.settings__item--text > label,
.settings__item--full-width.settings__item--textarea > label {
  flex: 0 0 auto;
  white-space: nowrap;
}
.settings__item--text > input,
.settings__item--textarea > textarea {
  flex: 1 1 auto;
  width: auto;
  padding: 2px 4px;
  box-sizing: border-box;
  font-family: var(--font);
  font-size: calc(var(--font-size) * 0.9);
  background-color: var(--white);
  border: 0;
  outline: none;
  border-radius: 4px;
  transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.settings__item--textarea > textarea {
  resize: vertical;
}
.settings__item--color > input,
.settings__item--full-width.settings__item--text > input,
.settings__item--full-width.settings__item--textarea > textarea {
  flex: 1 1 100%;
}
.settings__item--text > input:hover,
.settings__item--textarea > textarea:hover {
  box-shadow: var(--hover-ring);
}
.settings__item--text > input:focus,
.settings__item--textarea > textarea:focus {
  box-shadow: var(--focus-ring);
}
.settings__item--color > input {
  padding-left: 24px;
}
.settings__item-color-pill {
  position: absolute;
  bottom: 1px;
  left: 2px;
  height: 14px;
  width: 14px;
  border-radius: 2px;
  border: 1px solid gray;
}
.settings__item > label > em {
  padding: 2px 3px;
  font-size: calc(var(--font-size) - 2px);
  color: var(--foreground);
  background-color: var(--minor);
  border-radius: 2px;
}
.settings__documentation {
  width: 100%;
  margin-top: 5px;
  padding: 10px;
  color: var(--white);
  background-color: var(--main-alt);
  font-weight: 700;
  border-radius: 5px;
}
.settings__documentation-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  margin-top: -2px;
  vertical-align: middle;
  fill: currentColor;
}
.settings__documentation a {
  color: currentColor;
}
.settings__infos {
  width: 100%;
  margin-top: 5px;
  padding: 10px;
  color: var(--foreground);
  background-color: var(--minor);
  border-radius: 5px;
}
.settings__infos-title {
  margin-bottom: 7px;
  font-size: calc(var(--font-size) * 1.1);
  font-weight: 700;
}
.settings__info {
  font-style: italic;
}
.settings__bottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
}
.settings__pending-changes {
  margin: 0 10px;
}
.settings__refresh-button,
.settings__import-button,
.settings__export-button {
  padding: 7px 10px;
  font-family: var(--font);
  font-size: calc(var(--font-size) * 0.9);
  border-radius: var(--item-radius);
  border: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
}
.settings__import-button,
.settings__export-button {
  margin-right: 10px;
  color: var(--foreground);
  background-color: var(--minor);
}
.settings__export-button {
  margin-left: 10px;
}
.settings__refresh-button {
  background-color: var(--green);
}
.settings__refresh-button:not(:disabled),
.settings__import-button:not(:disabled),
.settings__export-button:not(:disabled) {
  box-shadow: var(--light-shadow);
}
.settings__refresh-button:not(:disabled):hover,
.settings__import-button:not(:disabled):hover,
.settings__export-button:not(:disabled):hover {
  box-shadow: var(--light-shadow), var(--focus-ring);
}
.settings__refresh-button:disabled,
.settings__import-button:disabled,
.settings__export-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.settings__import-export-label {
  margin-right: auto;
}
.settings__widgets {
  width: 100%;
}
.settings__widgets-breadcrumb {
  height: 28px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0 5px;
  margin-bottom: 5px;
}
.settings__widgets-breadcrumb-title {
  font-size: calc(var(--font-size) * 1.2);
  font-weight: 700;
}
button.settings__widgets-breadcrumb-title {
  padding: 0;
  color: inherit;
  font-family: inherit;
  background-color: transparent;
  text-decoration: underline;
  cursor: pointer;
  border: 0;
}
.settings__widgets-breadcrumb-current {
  margin-bottom: -2px;
}
.settings__widgets-breadcrumb-back {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 2px 10px;
  background-color: var(--minor);
  border: 1px solid var(--foreground-alt);
  border-radius: var(--item-radius);
  color: var(--foreground);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  box-sizing: border-box;
  transition: color 160ms var(--transition-easing),
    background-color 160ms var(--transition-easing),
    box-shadow 160ms var(--transition-easing);
}
.settings__widgets-breadcrumb-back:hover {
  box-shadow: var(--hover-ring);
}
.settings__widgets-breadcrumb-back-icon {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  fill: currentColor;
}
.settings__widgets-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.settings__widgets-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: var(--minor);
  border-radius: var(--item-radius);
}
.settings__widgets-item:not(.settings__widgets-item--process) {
  cursor: pointer;
}
.settings__widgets-item-icon {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  margin-left: auto;
  fill: currentcolor;
}
.settings__widget-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
${userWidgetsCreatorStyles}
${aerospaceDisplayManagerStyles}
`;
