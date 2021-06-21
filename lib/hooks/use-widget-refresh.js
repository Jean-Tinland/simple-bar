import { React } from 'uebersicht'

const { useEffect } = React

export const useWidgetRefresh = (active, getter, refreshFrequency) => {
  useEffect(() => {
    if (active) {
      getter()
      const interval = setInterval(getter, refreshFrequency)
      return () => clearInterval(interval)
    }
  }, [])
}
