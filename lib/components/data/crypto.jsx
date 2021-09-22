import useWidgetRefresh from "../../hooks/use-widget-refresh"
import * as Uebersicht from 'uebersicht'
import * as Settings from '../../settings'
import * as Icons from "../icons.jsx"
import * as Utils from '../../utils'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'

const settings = Settings.get()

const refreshFrequency = 5*60*1000 // 30 seconds * 1000 milliseconds

const getIcon = (identifier) => {
  switch (identifier) {
    case "celo": return Icons.Celo
    case "ethereum": return Icons.Ethereum
    case "bitcoin": return Icons.Bitcoin
    default: return Icons.Moon
  }
}

const getDenominatorToken = (denomination) => {
  switch (denomination) {
    case "usd": return '$'
    case "eur": return "€"
    default: return ''
  }
}

const openCrypto = (e) => {
  Utils.clickEffect(e)
  Utils.notification('Opening price chart from coingecko.com...')
}

export const Widget = () => {
  const ref = Uebersicht.React.useRef()
  const { widgets, cryptoWidgetOptions } = settings
  const { denomination, identifiers, precision } = cryptoWidgetOptions
  const enumeratedIdentifiers = identifiers.split(',')
  const { cryptoWidget } = widgets

  
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(cryptoWidget)

  const getCrypto = async () => {
    const response = await Uebersicht.run(`curl -s \
      -H "Accept: application/json" \
      -G https://api.coingecko.com/api/v3/simple/price \
      -d ids=${identifiers} \
      -d vs_currencies=${denomination}`
    )

    const result = JSON.parse(response)
    let priceMap = {}
    enumeratedIdentifiers.forEach((id) => {
      priceMap[id] = `${getDenominatorToken(denomination)}${parseFloat(result[id][denomination]).toPrecision(precision)}`
    })
    setState(priceMap)
    setLoading(false)
  }

  useWidgetRefresh(cryptoWidget, getCrypto, refreshFrequency)

  const refreshCrypto = (e) => {
    Utils.clickEffect(e)
    setLoading(true)
    getCrypto()
    Utils.notification('Refreshing price from coingecko.com...')
  }

  if (loading) return <DataWidgetLoader.Widget className="crypto" />
  if (!state) return null

  const classes = Utils.classnames('crypto')

  return enumeratedIdentifiers.map((id) =>
    <DataWidget.Widget
      key={id}
      classes={classes}
      ref={ref}
      Icon={getIcon(id)}
      href={`https://coingecko.com/en/coins/${id}`}
      onClick={openCrypto}
      onRightClick={refreshCrypto}
    >
      <div>{state[id]}</div>
    </DataWidget.Widget>
  )
}