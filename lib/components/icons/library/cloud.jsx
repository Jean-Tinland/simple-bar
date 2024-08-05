import Icon from "../icon.jsx";
import * as Utils from "../../../utils";

export default function Cloud(props) {
  return (
    <Icon
      {...props}
      className={Utils.classNames(props.className, "cloud-icon")}
    >
      <path d="M17.173 8.725a2.181 2.181 0 0 1-2.112-1.636 6.544 6.544 0 1 0-6.331 8.18h9.817a3.272 3.272 0 1 0 0-6.544h-1.374ZM8.73 17.45a8.725 8.725 0 1 1 8.442-10.906h1.374a5.453 5.453 0 1 1 0 10.906H8.73Z" />
    </Icon>
  );
}
