import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Uebersicht from 'uebersicht'
import * as Settings from '../../settings'
import * as Icons from '../icons.jsx'
import * as Utils from '../../utils'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'

export { cryptoStyles as styles } from '../../styles/components/data/crypto'

const settings = Settings.get()
const { widgets, cryptoWidgetOptions } = settings
const { refreshFrequency, denomination, identifiers, precision } = cryptoWidgetOptions

const DEFAULT_REFRESH_FREQUENCY = 5 * 60 * 1000 // 30 seconds * 1000 milliseconds
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY)

const getIcon = (identifier) => {
  if (identifier === 'celo') return Icons.Celo
  if (identifier === 'ethereum') return Icons.Ethereum
  if (identifier === 'bitcoin') return Icons.Bitcoin
  return Icons.Moon
}

const getDenominatorToken = (denomination) => {
  if (denomination === 'usd') return '$'
  if (denomination === 'eur') return '€'
  return ''
}

const openCrypto = (e) => {
  Utils.clickEffect(e)
  Utils.notification('Opening price chart from coingecko.com...')
}

export const Widget = () => {
  const ref = Uebersicht.React.useRef()
  const denominatorToken = getDenominatorToken(denomination)
  const cleanedUpIdentifiers = identifiers.replace(/ /g, '')
  const enumeratedIdentifiers = cleanedUpIdentifiers.replace(/ /g, '').split(',')
  const { cryptoWidget } = widgets

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(cryptoWidget)

  const getCrypto = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cleanedUpIdentifiers}&vs_currencies=${denomination}`
    )
    const result = await response.json()

    const prices = enumeratedIdentifiers.map((id) => {
      const value = result[id][denomination].toPrecision(precision)
      return `${denominatorToken}${value}`
    })
    setState(prices)
    setLoading(false)
  }

  useWidgetRefresh(cryptoWidget, getCrypto, REFRESH_FREQUENCY)

  const refreshCrypto = (e) => {
    Utils.clickEffect(e)
    setLoading(true)
    getCrypto()
    Utils.notification('Refreshing price from coingecko.com...')
  }

  if (loading) return <DataWidgetLoader.Widget className="crypto" />
  if (!state) return null

  const classes = Utils.classnames('crypto')

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
  ))
}
