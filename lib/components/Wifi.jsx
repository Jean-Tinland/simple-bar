import { Wifi, WifiOff } from './Icons.jsx';

const render = ({ output }) => {
  if (!output) return null;
  const { status, ssid } = output;
  const isActive = status === 'active';

  const classes = isActive ? 'wifi' : 'wifi wifi--inactive';

  const Icon = isActive ? Wifi : WifiOff;

  return (
    <div className={classes}>
      <Icon className="wifi__icon" />
      {ssid && ssid}
    </div>
  );
};

export default render;
