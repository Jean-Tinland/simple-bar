export const userWidgetsCreatorStyles = /* css */ `
  .user-widgets-creator {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .user-widgets-creator__add {
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
  .user-widget-creator__remove {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: 7px;
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
    width: 12px;
    height: 12px;
    fill: var(--white);
  }
`
