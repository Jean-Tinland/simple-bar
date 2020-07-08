import { Wifi, WifiOff } from './Icons.jsx';
import { run } from "uebersicht";

const wifi_on = () => {
  run(`osascript -e 'tell app "System Events" to display notification "enabling wifi." with title "simple-bar"'`);
  run(`networksetup -setairportpower en0 on`);
};

const wifi_off = () => {
  run(`osascript -e 'tell app "System Events" to display notification "disabling wifi." with title "simple-bar"'`);
  run(`networksetup -setairportpower en0 off`);
};

const render = ({ output }) => {
  if (!output) return null;
  const { status, ssid } = output;
  const isActive = status === 'active';

  const classes = 'clickable' + isActive ? 'wifi' : 'wifi wifi--inactive';

  const Icon = isActive ? Wifi : WifiOff;

  const wifi_exec = isActive ? wifi_off : wifi_on;

  return (
    <div className={classes} onClick={wifi_exec}>
      <Icon className="wifi__icon" />
      {ssid && ssid}
    </div>
  );
};

export default render;
