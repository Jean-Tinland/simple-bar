import Time from './lib/components/Time.jsx';
import DateDisplay from './lib/components/Date.jsx';
import Divider from './lib/components/Divider.jsx';
import Battery from './lib/components/Battery.jsx';
import Wifi from './lib/components/Wifi.jsx';
import {
  ProcessStyles,
  DateStyles,
  TimeStyles,
  DividerStyles,
  BatteryStyles,
  WifiStyles
} from './lib/styles/Styles.js';
import { Theme } from './lib/styles/Theme.js';

const refreshFrequency = 10000;

const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.log(error);
    return;
  }
};

const className = `
  .simple-bar__error {
    text-align: center;
  }
  .simple-bar__data {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    margin-left: auto;
    padding: 5px 8px;
    color: white;
    font-family: ${Theme.font};
    font-size: 12px;
  }
  .simple-bar__data > *:not(:last-of-type) {
    margin-right: 5px;
  }
  ${DateStyles}
  ${TimeStyles}
  ${DividerStyles}
  ${BatteryStyles}
  ${WifiStyles}
`;

const command = 'bash simple-bar/lib/scripts/get_data.sh';

const render = ({ output, error }) => {
  console.log({ output, error });
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>;
  const data = parseJson(output);
  if (!data) return <div className="simple-bar__error">JSON error...</div>;
  const { time, battery, wifi } = data;
  return (
    <div className="simple-bar__data">
      <Battery output={battery} />
      <Divider />
      <Wifi output={wifi} />
      <Divider />
      <DateDisplay />
      <Divider />
      <Time output={time} />
    </div>
  );
};

export { command, refreshFrequency, className, render };
