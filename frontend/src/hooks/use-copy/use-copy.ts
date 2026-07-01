import { useState } from 'react'

/** The use copy return type */
export interface UseCopyReturn {
  /** Whether copy is in progress */
  copied: boolean
  /** The copied value */
  value?: string
  /** Function to copy text */
  copy: (value: string) => Promise<void>
}

/** The use copy params type */
export interface UseCopyParams {
  /** Reset delay in milliseconds */
  resetDelay?: number
}

export const useCopy = (delay: number = 1000): UseCopyReturn => {
  const [value, setValue] = useState<string | undefined>()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setValue(text)
    setCopied(true)
    setTimeout(setCopied, delay, false)
  }

  return { value, copied, copy: copyToClipboard }
}
