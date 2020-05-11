const DateDisplay = () => {
  var options = { weekday: 'long', month: 'long', day: 'numeric' };
  var today = new Date();
  return <div className="date">{today.toLocaleDateString('en-UK', options)}</div>;
};

export default DateDisplay;
