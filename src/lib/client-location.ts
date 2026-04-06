const LOCATION_CHANGE_EVENT = "wms:locationchange";

declare global {
  interface Window {
    __wmsHistoryPatched?: boolean;
  }
}

const dispatchLocationChange = () => {
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
};

const ensureHistoryPatched = () => {
  if (typeof window === "undefined" || window.__wmsHistoryPatched) return;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = ((...args: Parameters<History["pushState"]>) => {
    const result = originalPushState(...args);
    dispatchLocationChange();
    return result;
  }) as History["pushState"];

  window.history.replaceState = ((...args: Parameters<History["replaceState"]>) => {
    const result = originalReplaceState(...args);
    dispatchLocationChange();
    return result;
  }) as History["replaceState"];

  window.__wmsHistoryPatched = true;
};

export const getCurrentBrowserUrl = () => {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href);
};

export const subscribeToLocationChange = (callback: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  ensureHistoryPatched();
  window.addEventListener(LOCATION_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener(LOCATION_CHANGE_EVENT, callback);
  };
};
