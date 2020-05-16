import Process from './lib/components/Process.jsx';
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

const refreshFrequency = 3000;

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
    font-family: ${Theme.font};
    font-size: 12px;
    background-color: ${Theme.main};
  }
  .simple-bar--empty {
    text-align: center;
  }
  ${ProcessStyles}
`;

const command = 'bash simple-bar/lib/scripts/get_process.sh';

const render = ({ output, error }) => {
  console.log({ output, error });
  if (!output || error) return <div className="simple-bar simple-bar--empty">Something went wrong...</div>;
  const data = parseJson(output);
  if (!data) return <div className="simple-bar simple-bar--empty">JSON error...</div>;
  const { process } = data;
  return (
    <div className="simple-bar">
      <Process output={process} />
    </div>
  );
};

export { command, refreshFrequency, className, render };
