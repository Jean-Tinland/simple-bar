import { ChargingBattery, FullBattery, HalfBattery, LowBattery } from './Icons.jsx';

const Battery = ({ output }) => {
  if (!output) return;
  const { percentage, charging /*, remaining */ } = output;
  const isFullBattery = percentage > 90 && !charging;
  const isLowBattery = percentage < 10 && !charging;

  let Icon = HalfBattery;

  if (charging) {
    Icon = ChargingBattery;
  } else if (isFullBattery) {
    Icon = FullBattery;
  } else if (isLowBattery) {
    Icon = LowBattery;
  }

  const classes = isLowBattery ? 'battery battery--low' : 'battery';

  return (
    <div className={classes}>
      <Icon className="battery__icon" />
      {percentage}%
    </div>
  );
};

// https://www.flaticon.com/packs/battery-status

export default Battery;
