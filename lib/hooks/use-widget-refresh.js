import * as Uebersicht from "uebersicht";

const { React } = Uebersicht;

export default function useWidgetRefresh(active, getter, refreshFrequency) {
  const abortableGetter = React.useCallback(
    (signal) => {
      if (!active || signal.aborted) return;
      getter();
    },
    [active, getter]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    if (active) {
      abortableGetter(controller.signal);
      const interval = setInterval(
        () => abortableGetter(controller.signal),
        refreshFrequency
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
