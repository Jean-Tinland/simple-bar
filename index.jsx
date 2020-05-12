import SpacesDisplay from './lib/components/SpacesDisplay.jsx';
import Process from './lib/components/Process.jsx';
import Time from './lib/components/Time.jsx';
import DateDisplay from './lib/components/Date.jsx';
import Divider from './lib/components/Divider.jsx';
import Battery from './lib/components/Battery.jsx';
import {
  SpacesDisplayStyles,
  ProcessStyles,
  DateStyles,
  TimeStyles,
  DividerStyles,
  BatteryStyles
} from './lib/styles/Styles.js';
import { Theme } from './lib/styles/Theme.js';

const refreshFrequency = 10000;

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
    margin-right: 10px;
  }
  ${SpacesDisplayStyles}
  ${ProcessStyles}
  ${DateStyles}
  ${TimeStyles}
  ${DividerStyles}
  ${BatteryStyles}
`;

const command = 'bash simple-bar/lib/scripts/get_data.sh';

const render = ({ output, error }) => {
  console.log({ output, error });
  if (!output || error) return <div className="simple-bar simple-bar--empty">Something went wrong...</div>;
  const data = JSON.parse(output);
  const { process, spaces, time, battery } = data;
  return (
    <div className="simple-bar">
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      <SpacesDisplay output={spaces} />
      <Process output={process} />
      <div className="simple-bar__data">
        <Battery output={battery} />
        <Divider />
        <DateDisplay />
        <Divider />
        <Time output={time} />
      </div>
    </div>
  );
};

export { command, refreshFrequency, className, render };
