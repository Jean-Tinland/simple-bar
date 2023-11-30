import * as Uebersicht from "uebersicht";
export { specterStyles as styles } from "../../styles/components/data/specter";

export const Widget = Uebersicht.React.memo(() => {
  return (
    <div className="specter">
      {[...new Array(6)].map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
});
