import Icon from "../icon.jsx";

export default function DownArrow(props) {
  return (
    <Icon {...props}>
      <path
        fill="var(--red)"
        d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"
      />
    </Icon>
  );
}
