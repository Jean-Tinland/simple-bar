import * as Uebersicht from "uebersicht";
import * as Specter from "./specter.jsx";
import * as Utils from "../../utils";
import { SuspenseIcon } from "../icons/icon.jsx";
export { dataWidgetStyles as styles } from "../../styles/components/data/data-widget";

const { React } = Uebersicht;

/**
 * Widget component that renders a clickable data widget with optional icon and specter.
 * @param {Object} props - The properties object.
 * @param {React.Component} props.Icon - The icon component to display.
 * @param {string} props.classes - Additional classes for the widget.
 * @param {string} props.href - The URL to link to.
 * @param {function} props.onClick - The click event handler.
 * @param {function} props.onRightClick - The right-click event handler.
 * @param {function} props.onMiddleClick - The middle-click event handler.
 * @param {Object} props.style - The style object.
 * @param {boolean} props.disableSlider - Flag to disable the slider effect.
 * @param {boolean} props.showSpecter - Flag to show the specter widget.
 * @param {React.ReactNode} props.children - The child elements to render inside the widget.
 * @returns {React.ReactElement} The rendered widget component.
 */
export function Widget({
  Icon,
  classes,
  href,
  onClick,
  onRightClick,
  onMiddleClick,
  style,
  disableSlider,
  showSpecter,
  children,
}) {
  const ref = React.useRef();

  let Tag = "div";
  if (onClick) Tag = "button";
  if (href) Tag = "a";

  const dataWidgetClasses = Utils.classNames("data-widget", classes, {
    "data-widget--clickable": href || onClick,
  });

  /**
   * Handles the click event, determining the appropriate action based on the event.
   * @param {MouseEvent} e - The mouse event.
   */
  const onClickProp = (e) => {
    const { metaKey } = e;
    const action = metaKey || isMiddleClick(e) ? onMiddleClick : onClick;
    if (action) action(e);
  };

  /**
   * Handles the mouse enter event to start the sliding effect.
   */
  const onMouseEnter = () => {
    Utils.startSliding(
      ref.current,
      ".data-widget__inner",
      ".data-widget__slider"
    );
  };

  /**
   * Handles the mouse leave event to stop the sliding effect.
   */
  const onMouseLeave = () => {
    Utils.stopSliding(ref.current, ".data-widget__slider");
  };

  return (
    <Tag
      ref={ref}
      className={dataWidgetClasses}
      href={href}
      onClick={onClickProp}
      onContextMenu={onRightClick || undefined}
      onMouseEnter={!disableSlider ? onMouseEnter : undefined}
      onMouseLeave={!disableSlider ? onMouseLeave : undefined}
      style={style}
    >
      {Icon && (
        <SuspenseIcon>
          <Icon />
        </SuspenseIcon>
      )}
      {showSpecter && <Specter.Widget />}
      <Inner disableSlider={disableSlider}>{children}</Inner>
    </Tag>
  );
}

/**
 * Inner component that optionally wraps children with sliding effect elements.
 * @param {Object} props - The properties object.
 * @param {boolean} props.disableSlider - Flag to disable the slider effect.
 * @param {React.ReactNode} props.children - The child elements to render inside the inner component.
 * @returns {React.ReactElement} The rendered inner component.
 */
function Inner({ disableSlider, children }) {
  if (disableSlider) return children;
  return (
    <div className="data-widget__inner">
      <div className="data-widget__slider">{children}</div>
    </div>
  );
}

/**
 * Checks if the event is a middle-click.
 * @param {MouseEvent} e - The mouse event.
 * @returns {boolean} True if the event is a middle-click, false otherwise.
 */
function isMiddleClick(e) {
  return e.button === 1 || e["button&2"] === 1;
}
