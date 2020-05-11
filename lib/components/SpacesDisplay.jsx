export const refreshFrequency = false;

const SpacesDisplay = ({ output }) => {
  const { displays, spaces } = output;
  if (!output) {
    return <div className="simple-bar simple-bar--empty"></div>;
  }
  return displays.map((display, i) => {
    return (
      <div key={i} className="spaces-display">
        {spaces.map((space, i) => {
          const classes = space.focused ? 'space space--focused' : 'space';
          return display.index === space.display ? (
            <span key={i} className={classes}>
              {space.index}
            </span>
          ) : null;
        })}
      </div>
    );
  });
};

export default SpacesDisplay;
