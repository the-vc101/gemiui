export interface ElectronAPI {
  getAppVersion: () => Promise<string>
  openExternalLink: (url: string) => Promise<void>
  onMenuNewChat: (callback: () => void) => void
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}