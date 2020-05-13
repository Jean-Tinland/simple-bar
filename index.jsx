import SpacesDisplay from './lib/components/SpacesDisplay.jsx';
import Process from './lib/components/Process.jsx';
import Time from './lib/components/Time.jsx';
import DateDisplay from './lib/components/Date.jsx';
import Divider from './lib/components/Divider.jsx';
import Battery from './lib/components/Battery.jsx';
import Wifi from './lib/components/Wifi.jsx';
import {
  SpacesDisplayStyles,
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
  .simple-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 4px 5px;
    box-sizing: border-box;
    color: white;
    font-family: Roboto, sans-serif;
    font-size: 12px;
    background-color: ${Theme.main};
  }
  .simple-bar--empty {
    text-align: center;
  }
  .simple-bar__data {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-right: 7px;
  }
  .simple-bar__data > *:not(:last-of-type) {
    margin-right: 5px;
  }
  ${SpacesDisplayStyles}
  ${ProcessStyles}
  ${DateStyles}
  ${TimeStyles}
  ${DividerStyles}
  ${BatteryStyles}
  ${WifiStyles}
`;

const command = 'bash simple-bar/lib/scripts/get_data.sh';

const render = ({ output, error }) => {
  console.log({ output, error });
  if (!output || error) return <div className="simple-bar simple-bar--empty">Something went wrong...</div>;
  const data = parseJson(output);
  if (!data) return <div className="simple-bar simple-bar--empty">JSON error...</div>;
  const { process, spaces, time, battery, wifi } = data;
  console.log(wifi);
  return (
    <div className="simple-bar">
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      <SpacesDisplay output={spaces} />
      <Process output={process} />
      <div className="simple-bar__data">
        <Battery output={battery} />
        <Divider />
        <Wifi output={wifi} />
        <Divider />
        <DateDisplay />
        <Divider />
        <Time output={time} />
      </div>
    </div>
  );
};

export { command, refreshFrequency, className, render };
