export interface UmamiTracker {
  track: (
    payload?:
      | string
      | ((props: Record<string, unknown>) => Record<string, unknown>)
      | Record<string, unknown>,
  ) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export function trackEvent(
  name: string,
  data?: Record<string, string | number>,
): void {
  if (typeof window === "undefined" || !window.umami) return;
  window.umami.track({ name, data });
}

export function trackPageview(
  pathname: string,
  search: string,
): void {
  if (typeof window === "undefined" || !window.umami) return;
  const url = search ? `${pathname}?${search}` : pathname;
  window.umami.track((props) => ({ ...props, url }));
}
