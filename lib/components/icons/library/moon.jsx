import Icon from "../icon.jsx";
import * as Utils from "../../../utils";

export default function Moon(props) {
  return (
    <Icon {...props} className={Utils.classNames(props.className, "moon-icon")}>
      <path d="M12.081 2.509a1 1 0 0 1-.067 1.085 6 6 0 0 0 8.392 8.392 1 1 0 0 1 1.59.896A10 10 0 1 1 11.118 2.004a1 1 0 0 1 .963.505Zm-2.765 1.93a8 8 0 1 0 10.245 10.245A8 8 0 0 1 9.316 4.439Z" />
    </Icon>
  );
}
