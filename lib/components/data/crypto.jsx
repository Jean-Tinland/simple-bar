import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { cryptoStyles as styles } from "../../styles/components/data/crypto";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 5 * 60 * 1000; // Default refresh frequency set to 5 minutes

/**
 * Crypto Widget Component
 * @returns {JSX.Element|null} The Crypto Widget component
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings, pushMissive } = useSimpleBarContext();
  const { widgets, cryptoWidgetOptions } = settings;
  const { cryptoWidget } = widgets;
  const {
    refreshFrequency,
    denomination,
    identifiers,
    precision,
    showOnDisplay,
    showIcon,
  } = cryptoWidgetOptions;

  // Calculate the refresh frequency using the provided or default value
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible on the current display
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && cryptoWidget;

  const ref = React.useRef();
  const denominatorToken = getDenominatorToken(denomination);

  // Memoize cleanedUpIdentifiers to prevent recreation on every render
  const cleanedUpIdentifiers = React.useMemo(
    () => identifiers.replace(/ /g, ""),
    [identifiers],
  );

  // Memoize enumeratedIdentifiers to prevent recreation on every render
  const enumeratedIdentifiers = React.useMemo(
    () => cleanedUpIdentifiers.replace(/ /g, "").split(","),
    [cleanedUpIdentifiers],
  );

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  // Reset the widget state
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetches cryptocurrency prices from the CoinGecko API
   */
  const getCrypto = React.useCallback(async () => {
    if (!visible) return;
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cleanedUpIdentifiers}&vs_currencies=${denomination}`,
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

  useServerSocket("crypto", visible, getCrypto, resetWidget, setLoading);
  useWidgetRefresh(visible, getCrypto, refresh);

  /**
   * Refreshes the cryptocurrency prices
   * @param {Event} e - The event object
   */
  const refreshCrypto = (e) => {
    Utils.clickEffect(e);
    setLoading(true);
    getCrypto();
    Utils.notification("Refreshing price from coingecko.com...", pushMissive);
  };

  if (loading) return <DataWidgetLoader.Widget className="crypto" />;
  if (!state) return null;

  const classes = Utils.classNames("crypto");

  return enumeratedIdentifiers.map((id, i) => (
    <DataWidget.Widget
      key={id}
      classes={classes}
      ref={ref}
      Icon={showIcon ? getIcon(id) : null}
      href={`https://coingecko.com/en/coins/${id}`}
      onClick={(e) => openCrypto(e, pushMissive)}
      onRightClick={refreshCrypto}
    >
      {state[i]}
    </DataWidget.Widget>
  ));
});

Widget.displayName = "Crypto";

/**
 * Returns the icon component for a given cryptocurrency identifier
 * @param {string} identifier - The cryptocurrency identifier
 * @returns {JSX.Element} The icon component
 */
function getIcon(identifier) {
  if (identifier === "celo") return Icons.Celo;
  if (identifier === "ethereum") return Icons.Ethereum;
  if (identifier === "bitcoin") return Icons.Bitcoin;
  return Icons.Moon;
}

/**
 * Returns the symbol for a given denomination
 * @param {string} denomination - The denomination (e.g., "usd", "eur")
 * @returns {string} The symbol for the denomination
 */
function getDenominatorToken(denomination) {
  if (denomination === "usd") return "$";
  if (denomination === "eur") return "€";
  return "";
}

/**
 * Opens the cryptocurrency price chart
 * @param {Event} e - The event object
 * @param {Function} pushMissive - The function to push a notification
 */
function openCrypto(e, pushMissive) {
  Utils.clickEffect(e);
  Utils.notification("Opening price chart from coingecko.com...", pushMissive);
}
