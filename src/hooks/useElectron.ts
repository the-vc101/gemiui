import { useCallback } from 'react'

export const useElectron = () => {
  const openExternalLink = useCallback((url: string) => {
    // Check if we're in Electron environment
    if (window.electronAPI && window.electronAPI.openExternalLink) {
      window.electronAPI.openExternalLink(url)
    } else {
      // Fallback for browser environment
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const isElectron = !!window.electronAPI

  return {
    openExternalLink,
    isElectron
  }
}