import { ChargingBattery, FullBattery, HalfBattery, LowBattery } from './Icons.jsx';

export const refreshFrequency = 10000;

const Battery = ({ output }) => {
  if (!output) return;
  const { percentage, charging /*, remaining */ } = output;
  console.log(charging);
  const isFullBattery = percentage > 90 && !charging;
  const isLowBattery = percentage < 10 && !charging;

  const Icon = charging ? ChargingBattery : isFullBattery ? FullBattery : isLowBattery ? LowBattery : HalfBattery;

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
