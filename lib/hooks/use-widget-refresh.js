import * as Uebersicht from 'uebersicht'

const useWidgetRefresh = (active, getter, refreshFrequency) => {
  Uebersicht.React.useEffect(() => {
    if (active) {
      getter()
      const interval = setInterval(getter, refreshFrequency)
      return () => clearInterval(interval)
    }
  }, [active])
}
export default useWidgetRefresh
