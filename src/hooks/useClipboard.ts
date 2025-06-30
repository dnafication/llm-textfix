import { useState, useCallback } from 'react'

interface UseClipboardReturn {
  isCopied: boolean
  copyToClipboard: (text: string) => Promise<void>
}

/**
 * Custom hook for clipboard operations with feedback
 */
export const useClipboard = (resetDelay = 3000): UseClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      
      // Reset the copied state after delay
      setTimeout(() => {
        setIsCopied(false)
      }, resetDelay)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }, [resetDelay])

  return {
    isCopied,
    copyToClipboard
  }
}
