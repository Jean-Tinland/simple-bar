import Icon from "../icon.jsx";

export default function Element(props) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24a12 12 0 100-24 12 12 0 000 24zM9.8 5.6c0-.5.4-.9.9-.9a6 6 0 016 6 .9.9 0 01-1.8 0c0-2.4-1.9-4.2-4.2-4.2a.9.9 0 01-.9-1zm9.5 5a.9.9 0 00-1.8 0c0 2.4-1.9 4.2-4.2 4.2a.9.9 0 100 1.8 6 6 0 006-6zm-5 7.8c0 .5-.5.9-1 .9a6 6 0 01-6-6 .9.9 0 011.8 0c0 2.4 2 4.2 4.2 4.2.5 0 1 .4 1 1zm-9.6-5a.9.9 0 001.8 0c0-2.4 1.9-4.2 4.2-4.2a.9.9 0 100-1.8 6 6 0 00-6 6z"
      />
    </Icon>
  );
}
