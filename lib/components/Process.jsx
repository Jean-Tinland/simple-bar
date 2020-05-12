const Process = ({ output }) => {
  if (!output) return null;
  const [currentApp] = output.filter((app) => app.focused === 1);
  if (!currentApp) return null;
  const { app, title } = currentApp;
  return (
    <div className="process">
      {app} / {title}
    </div>
  );
};

export default Process;
