import type { OneSignalSdk, WindowWithOneSignal } from "@/types/onesignal";

export type SubscribeState =
  | "loading"
  | "unconfigured"
  | "unsupported"
  | "subscribed"
  | "denied"
  | "default";

function push(cb: (sdk: OneSignalSdk) => void) {
  const w = window as unknown as WindowWithOneSignal;
  w.OneSignalDeferred = w.OneSignalDeferred || [];
  w.OneSignalDeferred.push(cb);
}

export function getSubscribeState(sdk: OneSignalSdk): SubscribeState {
  if (!sdk.Notifications.isPushSupported()) return "unsupported";
  if (sdk.User.PushSubscription.optedIn) return "subscribed";
  if (sdk.Notifications.permission) return "denied";
  return "default";
}

export function requestSubscription(): void {
  push((sdk) => {
    void sdk.User.PushSubscription.optIn();
  });
}

export function subscribeToChanges(cb: (state: SubscribeState) => void): void {
  push((sdk) => {
    cb(getSubscribeState(sdk));
    sdk.User.PushSubscription.addEventListener("change", () => {
      cb(getSubscribeState(sdk));
    });
    sdk.Notifications.addEventListener("permissionChange", () => {
      cb(getSubscribeState(sdk));
    });
  });
}

export function isOneSignalConfigured(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID)
  );
}
