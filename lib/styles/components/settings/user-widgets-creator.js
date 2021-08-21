import { colorPickerStyles } from './color-picker'
import { iconPickerStyles } from './icon-picker'

export const userWidgetsCreatorStyles = /* css */ `
  .user-widgets-creator {
    position: relative;
    max-height: 30vh;
    display: flex;
    flex-direction: column;
    padding: 0 10px 25px 0;
    border-radius: var(--item-radius);
    overflow: auto;
  }
  .user-widgets-creator::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .user-widgets-creator::-webkit-scrollbar-track {
    background-color: var(--main-alt);
    opacity: 0.1;
    border-radius: var(--item-radius);
  }
  .user-widgets-creator::-webkit-scrollbar-thumb {
    background: var(--foreground);
    border-radius: var(--item-radius);
  }
  .user-widgets-creator__add {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: 7px 10px;
    font-family: var(--font);
    font-size: calc(var(--font-size) * 0.9);
    background-color: var(--green);
    border-radius: var(--item-radius);
    border: 0;
    box-shadow: var(--light-shadow);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
  }
  .user-widgets-creator__add:hover {
    box-shadow: var(--light-shadow), var(--focus-ring);
  }
  .user-widgets-creator__add > svg {
    width: 10px;
    height: 10px;
    margin-right: 1ch;
  }

  .user-widget-creator {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 5px;
    z-index: 0;
  }
  .user-widget-creator::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--main-alt);
    border-radius: var(--item-radius);
    opacity: 0.1;
    z-index: -1;
  }
  .user-widget-creator__sort-buttons {
    position: absolute;
    top: 0;
    left: 17px;
    height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    touch-action: none;
  }
  .user-widget-creator__sort-button {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    pointer-events: auto;
    touch-action: auto;
  }
  .user-widget-creator__sort-button--before {
    margin-bottom: 5px;
  }
  .user-widget-creator__sort-button--after {
    margin-top: auto;
  }
  .user-widget-creator__sort-button > svg {
    width: 22px;
    height: 22px;
    fill: var(--foreground);
  }
  .user-widget-creator__remove {
    position: absolute;
    top: 2px;
    right: 2px;
    padding: 5px;
    background-color: var(--red);
    border-radius: var(--item-radius);
    border: 0;
    box-shadow: var(--light-shadow);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
  }
  .user-widget-creator__remove:hover {
    box-shadow: var(--light-shadow), var(--focus-ring);
  }
  .user-widget-creator__remove > svg {
    width: 10px;
    height: 10px;
    fill: var(--white);
  }
  .user-widget-creator__right {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
  }
  .user-widget-creator__right-top {
    display: flex;
    align-items: center;
  }
  .user-widget-creator__right-top > label {
    margin: 0 1ch 0 2ch;
  }
  .user-widget-creator__right > label {
    margin: 6px 0 3px 0;
  }
  .user-widget-creator input {
    width: auto;
    margin: 3px 0;
    padding: 2px 4px;
    box-sizing: border-box;
    font-family: var(--font);
    font-size: calc(var(--font-size) * 0.9);
    border: 0;
    outline: none;
    border-radius: 4px;
    transition: box-shadow 160ms var(--transition-easing), opacity 160ms var(--transition-easing);
  }
  .user-widget-creator input:hover {
    box-shadow: var(--hover-ring);
  }
  .user-widget-creator input:focus {
    box-shadow: var(--focus-ring);
  }
  ${colorPickerStyles}
  ${iconPickerStyles}
`
