import useWidgetRefresh from "../../hooks/use-widget-refresh";
import * as Uebersicht from "uebersicht";
import * as Settings from "../../settings";
import * as Utils from "../../utils";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";

export { stockStyles as styles } from "../../styles/components/data/stock";

const settings = Settings.get();
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

const DEFAULT_REFRESH_FREQUENCY = 15 * 60 * 1000; // 15 min
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(
  refreshFrequency,
  DEFAULT_REFRESH_FREQUENCY
);

const openStock = (e) => {
  Utils.clickEffect(e);
};

const getCurrencySymbol = (currency) => {
  if (currency === "EUR") return "€";
  if (currency === "USD") return "$";
  if (currency === "GBP") return "£";
  if (currency === "CNY") return "¥";
  if (currency === "JPY") return "¥";
  return `${currency} `;
};

const formatPriceChange = (priceChange) => {
  // Add a '+' for positive changes
  return (priceChange.startsWith("-") ? "" : "+") + priceChange;
};

export const Widget = ({ display }) => {
  const visible =
    Utils.isVisibleOnDisplay(display, showOnDisplay) && stockWidget;

  const ref = Uebersicht.React.useRef();
  const cleanedUpSymbols = symbols.replace(/ /g, "");
  const enumeratedSymbols = cleanedUpSymbols.replace(/ /g, "").split(",");

  const [state, setState] = Uebersicht.React.useState();
  const [loading, setLoading] = Uebersicht.React.useState(visible);

  const getStocks = async () => {
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
  };

  useWidgetRefresh(visible, getStocks, REFRESH_FREQUENCY);

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
};
