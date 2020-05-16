import SpacesDisplay from './lib/components/SpacesDisplay.jsx';
import { SpacesDisplayStyles } from './lib/styles/Styles.js';
import { Theme } from './lib/styles/Theme.js';

const refreshFrequency = false;

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
  .simple-bar__spaces {
    position: fixed;
    top: 0;
    left: 0;
    padding: 4px 5px;
    color: white;
    font-size: 12px;
    font-family: ${Theme.font};
  }
  ${SpacesDisplayStyles}
`;

const command = 'bash simple-bar/lib/scripts/get_spaces.sh';

const render = ({ output, error }) => {
  console.log({ output, error });
  if (!output || error) return <div className="simple-bar__error">Something went wrong...</div>;
  const data = parseJson(output);
  if (!data) return <div className="simple-bar__error">JSON error...</div>;
  const { spaces } = data;
  return (
    <div className="simple-bar__spaces">
      <SpacesDisplay output={spaces} />
    </div>
  );
};

export { command, refreshFrequency, className, render };
