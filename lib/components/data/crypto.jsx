import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { cryptoStyles as styles } from "../../styles/components/data/crypto";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 5 * 60 * 1000; // 30 seconds * 1000 milliseconds

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, cryptoWidgetOptions } = settings;
  const { cryptoWidget } = widgets;
  const {
    refreshFrequency,
    denomination,
    identifiers,
    precision,
    showOnDisplay,
  } = cryptoWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && cryptoWidget;

  const ref = React.useRef();
  const denominatorToken = getDenominatorToken(denomination);
  const cleanedUpIdentifiers = identifiers.replace(/ /g, "");
  const enumeratedIdentifiers = cleanedUpIdentifiers
    .replace(/ /g, "")
    .split(",");

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getCrypto = React.useCallback(async () => {
    if (!visible) return;
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cleanedUpIdentifiers}&vs_currencies=${denomination}`
    );
    const result = await response.json();

    const prices = enumeratedIdentifiers.map((id) => {
      const value = parseFloat(result[id][denomination]).toFixed(precision);
      return `${denominatorToken}${value}`;
    });
    setState(prices);
    setLoading(false);
  }, [
    visible,
    cleanedUpIdentifiers,
    denomination,
    enumeratedIdentifiers,
    precision,
    denominatorToken,
  ]);

  useServerSocket("crypto", visible, getCrypto, resetWidget);
  useWidgetRefresh(visible, getCrypto, refresh);

  const refreshCrypto = (e) => {
    Utils.clickEffect(e);
    setLoading(true);
    getCrypto();
    Utils.notification("Refreshing price from coingecko.com...");
  };

  if (loading) return <DataWidgetLoader.Widget className="crypto" />;
  if (!state) return null;

  const classes = Utils.classNames("crypto");

  return enumeratedIdentifiers.map((id, i) => (
    <DataWidget.Widget
      key={id}
      classes={classes}
      ref={ref}
      Icon={getIcon(id)}
      href={`https://coingecko.com/en/coins/${id}`}
      onClick={openCrypto}
      onRightClick={refreshCrypto}
    >
      {state[i]}
    </DataWidget.Widget>
  ));
});

Widget.displayName = "Crypto";

function getIcon(identifier) {
  if (identifier === "celo") return Icons.Celo;
  if (identifier === "ethereum") return Icons.Ethereum;
  if (identifier === "bitcoin") return Icons.Bitcoin;
  return Icons.Moon;
}

function getDenominatorToken(denomination) {
  if (denomination === "usd") return "$";
  if (denomination === "eur") return "€";
  return "";
}

function openCrypto(e) {
  Utils.clickEffect(e);
  Utils.notification("Opening price chart from coingecko.com...");
}
