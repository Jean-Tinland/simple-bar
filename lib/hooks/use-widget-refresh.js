import * as Uebersicht from "uebersicht";

const { React } = Uebersicht;

/**
 * Custom hook to refresh a widget at a specified frequency.
 *
 * @param {boolean} active - Flag indicating whether the widget is active.
 * @param {Function} getter - Function to fetch or update the widget data.
 * @param {number} refreshFrequency - Frequency in milliseconds to refresh the widget.
 */
export default function useWidgetRefresh(active, getter, refreshFrequency) {
  const abortableGetter = React.useCallback(
    (signal) => {
      if (!active || signal.aborted) return;
      getter();
    },
    [active, getter],
  );

  React.useEffect(() => {
    const controller = new AbortController();
    if (active) {
      abortableGetter(controller.signal);
      const interval = setInterval(
        () => abortableGetter(controller.signal),
        refreshFrequency,
      );
      return () => {
        controller.abort();
        clearInterval(interval);
      };
    } else {
      controller.abort();
    }
  }, [active, abortableGetter, refreshFrequency]);
}
