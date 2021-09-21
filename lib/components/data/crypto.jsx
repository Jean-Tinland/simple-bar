import useWidgetRefresh from "../../hooks/use-widget-refresh"
import * as Uebersicht from 'uebersicht'
import * as Settings from '../../settings'
import * as Icons from "../icons.jsx"
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'

export { cryptoStyles as styles } from '../../styles/components/data/crypto'

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

  if (loading) return <DataWidgetLoader.Widget className="crypto" />
  if (!state) return null

  return enumeratedIdentifiers.map((id) =>
    <DataWidget.Widget ref={ref} Icon={getIcon(id)}>
      <div className="crypto__inner">{state[id]}</div>
    </DataWidget.Widget>
  )
}