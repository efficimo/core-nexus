export {};

declare module "@efficimo/storage" {
  interface DefaultLocalStorageKeys {
    "#core-nexus/user-email": true;
    "#core-nexus/data-key": true;
  }
  interface DefaultSessionStorageKeys {
    "#core-nexus/authenticated": true;
  }
}
