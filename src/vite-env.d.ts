/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare module "*.json.enc" {
  const value: string;
  export default value;
}
