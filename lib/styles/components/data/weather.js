// Styles for /lib/components/data/weather.jsx component
export const weatherStyles = /* css */ `
.weather {
  position: relative;
  color: var(--foreground);
  background-color: var(--minor);
  overflow: hidden;
  z-index: 0;
}
.simple-bar--widgets-background-color-as-foreground .weather {
  background-color: transparent;
}
.weather__gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.65;
  z-index: -1;
}
.weather--sunrise .weather__gradient {
  background: linear-gradient(to top right, var(--main), var(--red), var(--yellow), var(--blue));
}
.weather--sunset .weather__gradient {
  background: linear-gradient(to bottom right, var(--blue), var(--yellow), var(--red), var(--magenta), var(--main));
}
.simple-bar--no-color-in-data .weather__gradient {
  display: none;
}
.sun-icon,
.moon-icon {
  transform-origin: 50% 50%;
  animation: sunny-and-moon-scale-and-rotate 2560ms ease infinite;
}
.simple-bar--animations-disabled .sun-icon,
.simple-bar--animations-disabled .moon-icon {
  animation: none;
}
@keyframes sunny-and-moon-scale-and-rotate {
  50% {
    transform: rotate(14deg);
  }
}
.cloud-icon {
  transform: translateY(-1%) rotate(5deg);
  animation: cloud-levitating 2560ms ease-in-out infinite;
}
.simple-bar--animations-disabled .cloud-icon {
  animation: none;
}
@keyframes cloud-levitating {
  50% {
    transform: translateY(10%) rotate(-3deg);
  }
}
.rain-icon > g > path {
  animation: rain-translate 2560ms ease-in-out infinite;
}
.simple-bar--animations-disabled .rain-icon > g > path {
  animation: none;
}
.rain-icon > g > path:nth-child(2) {
  animation-delay: 320ms;
}
.rain-icon > g > path:nth-child(1) {
  animation-delay: 640ms;
}
@keyframes rain-translate {
  0% {
    opacity: 0;
    transform: translateY(-10%);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: translateY(10%);
  }
}
.snow-icon > g > path {
  animation: snow-translate 2560ms ease-in-out infinite;
}
.simple-bar--animations-disabled .snow-icon > g > path {
  animation: none;
}
.snow-icon > g > path:nth-child(5) {
  animation-delay: 320ms;
}
.snow-icon > g > path:nth-child(4) {
  animation-delay: 640ms;
}
.snow-icon > g > path:nth-child(3) {
  animation-delay: 960ms;
}
.snow-icon > g > path:nth-child(2) {
  animation-delay: 1280ms;
}
.snow-icon > g > path:nth-child(1) {
  animation-delay: 1600ms;
}
@keyframes phasing-snow {
  50% {
    opacity: 0.1;
  }
}
.fog-icon > g > path {
  animation: fog-phasing 2560ms ease-in-out infinite;
}
.simple-bar--animations-disabled .fog-icon > g > path {
  animation: none;
}
.fog-icon > g > path:nth-child(8) {
  animation-delay: -640ms;
}
.fog-icon > g > path:nth-child(7) {
  animation-delay: -320ms;
}
.fog-icon > g > path:nth-child(5) {
  animation-delay: 320ms;
}
.fog-icon > g > path:nth-child(4) {
  animation-delay: 640ms;
}
.fog-icon > g > path:nth-child(3) {
  animation-delay: 960ms;
}
.fog-icon > g > path:nth-child(2) {
  animation-delay: 1280ms;
}
.fog-icon > g > path:nth-child(1) {
  animation-delay: 1600ms;
}
@keyframes fog-phasing {
  50% {
    opacity: 0.2;
  }
}
.storm-icon > g > path {
  animation: flashing-storm 2560ms ease-in-out infinite;
}
.simple-bar--animations-disabled .storm-icon > g > path {
  animation: none;
}
.storm-icon > g > path:nth-child(2) {
  animation-delay: 320ms;
}
.storm-icon > g > path:nth-child(1) {
  animation-delay: 640ms;
}
@keyframes flashing-storm {
  15%,
  30%,
  34% {
    opacity: 1;
  }
  16%,
  31% {
    opacity: 0;
  }
}
`;
