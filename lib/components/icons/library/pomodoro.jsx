import Icon from "../icon.jsx";

export default function Pomodoro(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="14.4" r="7.1" />
      <path d="M12 7.6c-1.5-2.3-3.8-3.2-5.7-2.7.5 1.9 2.1 3.2 4.2 3.4H12z" />
      <path d="M12 7.6c1.5-2.3 3.8-3.2 5.7-2.7-.5 1.9-2.1 3.2-4.2 3.4H12z" />
    </Icon>
  );
}
