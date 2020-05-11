const Time = ({ output }) => {
  if (!output) return null;
  return <div className="time">{output}</div>;
};

export default Time;
