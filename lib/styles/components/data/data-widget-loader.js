export const dataWidgetLoaderStyles = /* css */ `
.data-widget-loader {
  animation: data-widget-loader-appearance 320ms var(--transition-easing);
}
@keyframes data-widget-loader-appearance {
  0% {
    opacity: 0;
  }
}
.data-widget-loader::before {
  content: "";
  width: 10px;
  height: 10px;
  margin-right: 7px;
  background-color: currentColor;
  border-radius: 50%;
  opacity: 0.75;
}
.data-widget-loader__inner {
  border: 2px solid transparent;
  border-bottom-color: currentColor;
  box-sizing: border-box;
  border-radius: 50%;
  animation: data-widget-loader-spining 640ms ease infinite;
}
@keyframes data-widget-loader-spining {
  100% {
    transform: rotate(360deg);
  }
}
`
