import { PROBLEMATIC_CHARS, type ProblematicChar } from '../constants/characters'

/**
 * Escapes HTML characters to prevent XSS attacks
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Gets CSS classes for highlighting based on character category
 */
export const getHighlightClasses = (category: ProblematicChar['category']): string => {
  const baseClasses = 'relative font-bold rounded px-1 py-0.5 cursor-help border'
  
  switch (category) {
    case 'quote':
      return `${baseClasses} bg-amber-100 text-amber-700 border-amber-300`
    case 'dash':
      return `${baseClasses} bg-purple-100 text-purple-700 border-purple-300`
    case 'space':
      return `${baseClasses} bg-red-100 text-red-700 border-red-300 space-indicator`
    case 'punctuation':
      return `${baseClasses} bg-green-100 text-green-700 border-green-300`
    default:
      return baseClasses
  }
}

/**
 * Counts the number of problematic characters in text
 */
export const countProblematicChars = (text: string): number => {
  let count = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] in PROBLEMATIC_CHARS) {
      count++
    }
  }
  return count
}

/**
 * Replaces all problematic characters with their standard equivalents
 */
export const replaceProblematicChars = (text: string): string => {
  let cleanedText = text
  for (const [char, info] of Object.entries(PROBLEMATIC_CHARS)) {
    cleanedText = cleanedText.replaceAll(char, info.replacement)
  }
  return cleanedText
}

/**
 * Generates HTML with highlighted problematic characters
 */
export const generateHighlightedHtml = (text: string): string => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char in PROBLEMATIC_CHARS) {
      const info = PROBLEMATIC_CHARS[char]
      const classes = getHighlightClasses(info.category)
      const escapedChar = escapeHtml(char)
      const escapedName = escapeHtml(info.name)
      const escapedReplacement = escapeHtml(info.replacement)
      result += `<span class='${classes}' title='${escapedName} → ${escapedReplacement}'>${escapedChar}</span>`
    } else {
      result += escapeHtml(char)
    }
  }
  return result
}
