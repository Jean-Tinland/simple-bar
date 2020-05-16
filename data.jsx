import Time from './lib/components/Time.jsx';
import DateDisplay from './lib/components/Date.jsx';
import Divider from './lib/components/Divider.jsx';
import Battery from './lib/components/Battery.jsx';
import Sound from './lib/components/Sound.jsx';
import Wifi from './lib/components/Wifi.jsx';

import { parseJson } from './lib/utils.js';

import { DateStyles, TimeStyles, DividerStyles, BatteryStyles, WifiStyles, SoundStyles } from './lib/styles/Styles.js';
import { Theme } from './lib/styles/Theme.js';

const refreshFrequency = 2000;

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
  ${SoundStyles}
`;

const command = 'bash simple-bar/lib/scripts/get_data.sh';

const render = ({ output, error }) => {
  console.log({ output, error });
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>;
  const data = parseJson(output);
  if (!data) return <div className="simple-bar__error">JSON error...</div>;
  const { time, battery, wifi, sound } = data;
  return (
    <div className="simple-bar__data">
      <Battery output={battery} />
      <Divider />
      <Sound output={sound} />
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
