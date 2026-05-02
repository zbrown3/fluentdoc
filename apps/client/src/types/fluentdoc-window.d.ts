interface FluentdocBackendInfo {
  port: number;
  baseUrl: string;
}

interface FluentdocDesktopBridge {
  getBackendInfo:
    | (() => FluentdocBackendInfo)
    | (() => Promise<FluentdocBackendInfo>);
}

declare global {
  interface Window {
    fluentdoc?: FluentdocDesktopBridge;
  }
}

export {};
