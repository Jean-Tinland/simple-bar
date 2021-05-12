export const VPNStyles = /* css */ `
.vpn {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  background-color: var(--red);
  border-radius: 2px;
  box-shadow: var(--light-shadow);
  cursor: pointer;
  transition: background-color 160ms var(--transition-easing), opacity 160ms var(--transition-easing), 
    transform 160ms var(--transition-easing);
}
.vpn--disconnected {
  background-color: var(--minor);
}
.vpn:active {
  background-color: var(--minor);
  transform: scale(0.9);
}
.vpn--disconnected:active {
  background-color: var(--red);
}
.vpn__icon {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  fill: var(--main);
}
`
