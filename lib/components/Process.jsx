const Process = ({ output }) => {
  if (!output) return null;
  const { app, title } = output;
  return (
    <div className="process">
      {app} / {title}
    </div>
  );
};

export default Process;
