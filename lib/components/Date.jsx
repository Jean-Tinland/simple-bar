const DateDisplay = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const now = new Date().toLocaleDateString('en-UK', options);
  return <div className="date">{now}</div>;
};

export default DateDisplay;
