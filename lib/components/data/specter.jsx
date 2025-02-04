import * as Uebersicht from "uebersicht";

export { specterStyles as styles } from "../../styles/components/data/specter";

const { React } = Uebersicht;

/**
 * Specter widget component
 *
 * This component renders a div with six span elements inside it. These are animated in CSS.
 *
 * @returns {JSX.Element} The rendered widget component
 */
export const Widget = React.memo(() => {
  return (
    <div className="specter">
      {[...new Array(6)].map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
});

Widget.displayName = "Specter";
