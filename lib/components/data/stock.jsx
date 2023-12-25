import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { stockStyles as styles } from "../../styles/components/data/stock";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 15 * 60 * 1000; // 15 min

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, stockWidgetOptions } = settings;
  const { stockWidget } = widgets;
  const {
    refreshFrequency,
    yahooFinanceApiKey,
    symbols,
    showSymbol,
    showCurrency,
    showMarketPrice,
    showMarketChange,
    showMarketPercent,
    showColor,
    showOnDisplay,
  } = stockWidgetOptions;

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && stockWidget;

  const ref = React.useRef();
  const cleanedUpSymbols = symbols.replace(/ /g, "");
  const enumeratedSymbols = cleanedUpSymbols.replace(/ /g, "").split(",");

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getStocks = React.useCallback(async () => {
    if (!visible) return;
    const response = await fetch(
      `https://yfapi.net/v6/finance/quote?symbols=${cleanedUpSymbols}`,
      {
        headers: new Headers({ "x-api-key": yahooFinanceApiKey }),
      }
    );
    if (response.status === 429) {
      // Exceeded daily quota
    } else if (response.status === 403) {
      Utils.notification("Invalid Yahoo Finance API key");
    } else if (response.status === 200) {
      const result = await response.json();
      const symbolQuotes = result.quoteResponse.result;

      if (symbolQuotes.length !== enumeratedSymbols.length) {
        // One or more symbols is invalid
        const receivedSymbols = symbolQuotes.map((s) => s.symbol.toLowerCase());
        const invalidSymbols = enumeratedSymbols.filter(
          (s) => !receivedSymbols.includes(s)
        );
        Utils.notification("Invalid stock symbol(s): " + invalidSymbols);
      } else {
        setState({ symbolQuotes });
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("Unexpected response from Yahoo Finance API: ", response);
    }

    setLoading(false);
  }, [visible, cleanedUpSymbols, enumeratedSymbols, yahooFinanceApiKey]);

  useServerSocket("stock", visible, getStocks, resetWidget);
  useWidgetRefresh(visible, getStocks, refresh);

  const refreshStocks = (e) => {
    Utils.clickEffect(e);
    setLoading(true);
    getStocks();
  };

  if (loading) return <DataWidgetLoader.Widget className="stock" />;
  if (!state || !state.symbolQuotes) return null;

  const classes = Utils.classnames("stock");

  return enumeratedSymbols.map((symbolName, i) => {
    const symbolQuote = state.symbolQuotes[i];
    const symbol = symbolQuote.symbol;
    const currencySymbol = getCurrencySymbol(symbolQuote.currency);
    const marketPrice = Number(symbolQuote.regularMarketPrice).toFixed(2);
    const marketChange = Number(symbolQuote.regularMarketChange).toFixed(2);
    const marketPercentChange = Number(
      symbolQuote.regularMarketChangePercent
    ).toFixed(2);
    const stockUp = !marketChange.startsWith("-");

    return (
      <DataWidget.Widget
        key={symbolName}
        classes={classes}
        ref={ref}
        Icon={stockUp ? Icons.UpArrow : Icons.DownArrow}
        href={`https://finance.yahoo.com/quote/${symbolName}`}
        onClick={openStock}
        onRightClick={refreshStocks}
      >
        <span>
          {showSymbol && symbol}
          {(showCurrency || showMarketPrice) && showSymbol && (
            <span>&nbsp;</span>
          )}
          {showCurrency && currencySymbol}
          {showMarketPrice && marketPrice}
        </span>
        <span className={showColor ? (stockUp ? "stockUp" : "stockDown") : ""}>
          {(showMarketChange || showMarketPercent) && <span>&nbsp;</span>}
          {showMarketChange && formatPriceChange(marketChange)}
          {showMarketPercent &&
            showMarketChange &&
            ` (${formatPriceChange(marketPercentChange)}%)`}
          {showMarketPercent &&
            !showMarketChange &&
            `${formatPriceChange(marketPercentChange)}%`}
        </span>
      </DataWidget.Widget>
    );
  });
});

Widget.displayName = "Stock";

function openStock(e) {
  Utils.clickEffect(e);
}

function getCurrencySymbol(currency) {
  if (currency === "EUR") return "€";
  if (currency === "USD") return "$";
  if (currency === "GBP") return "£";
  if (currency === "CNY") return "¥";
  if (currency === "JPY") return "¥";
  return `${currency} `;
}

function formatPriceChange(priceChange) {
  // Add a '+' for positive changes
  return (priceChange.startsWith("-") ? "" : "+") + priceChange;
}
