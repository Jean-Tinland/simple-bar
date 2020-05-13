import { Charging } from './Icons.jsx';

const Battery = ({ output }) => {
  if (!output) return;
  const { percentage, charging /*, remaining */ } = output;
  const isCharging = charging === 'true';
  const isLowBattery = percentage < 10;

  const classes = isLowBattery ? 'battery battery--low' : 'battery';

  const transformValue = `scaleX(${
    percentage === '100' ? '1' : percentage < 10 ? `0.0${percentage}` : `0.${percentage}`
  })`;

  return (
    <div className={classes}>
      {isCharging && <Charging className="battery__charging-icon" />}
      <div className="battery__icon">
        <div className="battery__icon-filler" style={{ transform: transformValue }} />
      </div>
      {percentage}%
    </div>
  );
};

// https://www.flaticon.com/packs/battery-status

export default Battery;
