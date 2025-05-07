import Icon from "../icon.jsx";

export default function Cursor(props) {
  return (
    <Icon {...props}>
      <path d="M11.925 24l10.425-6-10.425-6L1.5 18l10.425 6z" fill="#888" />
      <path d="M22.35 18V6L11.925 0v12l10.425 6z" fill="#222" />
      <path d="M11.925 0L1.5 6v12l10.425-6V0z" fill="#888" />
      <path d="M22.35 6L11.925 24V12L22.35 6z" fill="#222" />
      <path d="M22.35 6l-10.425 6L1.5 6h20.85z" fill="#fff" />
      <path
        d="M11.925 24l10.425-6-10.425-6L1.5 18l10.425 6z"
        fill="none"
        stroke="#000"
        strokeWidth="0.5"
      />
      <path
        d="M22.35 18V6L11.925 0v12l10.425 6z"
        fill="none"
        stroke="#000"
        strokeWidth="0.5"
      />
      <path
        d="M11.925 0L1.5 6v12l10.425-6V0z"
        fill="none"
        stroke="#000"
        strokeWidth="0.5"
      />
    </Icon>
  );
}
