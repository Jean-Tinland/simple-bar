import Icon from "../icon.jsx";

export default function UpArrow(props) {
  return (
    <Icon {...props}>
      <path
        fill="var(--green)"
        d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"
      />
    </Icon>
  );
}
