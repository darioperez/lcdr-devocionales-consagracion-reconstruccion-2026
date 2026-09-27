export interface OneSignalSdk {
  init(options: {
    appId: string;
    autoResubscribe?: boolean;
    welcomeNotification?: { disable?: boolean };
  }): Promise<void>;
  Notifications: {
    isPushSupported(): boolean;
    permission: boolean;
    addEventListener(
      event: "permissionChange",
      cb: (granted: boolean) => void,
    ): void;
  };
  User: {
    PushSubscription: {
      optedIn: boolean;
      optIn(): Promise<void>;
      addEventListener(
        event: "change",
        cb: (ev: { current: { optedIn: boolean } }) => void,
      ): void;
    };
  };
}

export interface WindowWithOneSignal {
  OneSignalDeferred?: Array<(sdk: OneSignalSdk) => void>;
}
