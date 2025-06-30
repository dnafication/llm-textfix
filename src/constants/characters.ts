export interface ProblematicChar {
  name: string
  category: 'quote' | 'dash' | 'space' | 'punctuation'
  replacement: string
}

export const PROBLEMATIC_CHARS: Record<string, ProblematicChar> = {
  // Smart Quotes
  '\u201c': {
    name: 'Left double quotation mark',
    category: 'quote',
    replacement: '"'
  },
  '\u201d': {
    name: 'Right double quotation mark',
    category: 'quote',
    replacement: '"'
  },
  '\u2018': {
    name: 'Left single quotation mark',
    category: 'quote',
    replacement: "'"
  },
  '\u2019': {
    name: 'Right single quotation mark',
    category: 'quote',
    replacement: "'"
  },
  '\u201a': {
    name: 'Single low-9 quotation mark',
    category: 'quote',
    replacement: "'"
  },
  '\u201e': {
    name: 'Double low-9 quotation mark',
    category: 'quote',
    replacement: '"'
  },
  '\u00ab': {
    name: 'Left-pointing double angle quotation mark',
    category: 'quote',
    replacement: '"'
  },
  '\u00bb': {
    name: 'Right-pointing double angle quotation mark',
    category: 'quote',
    replacement: '"'
  },
  '\u2039': {
    name: 'Single left-pointing angle quotation mark',
    category: 'quote',
    replacement: "'"
  },
  '\u203a': {
    name: 'Single right-pointing angle quotation mark',
    category: 'quote',
    replacement: "'"
  },

  // Dashes & Hyphens
  '\u2013': { name: 'En dash', category: 'dash', replacement: '-' },
  '\u2014': { name: 'Em dash', category: 'dash', replacement: '-' },
  '\u2010': { name: 'Hyphen', category: 'dash', replacement: '-' },
  '\u2011': { name: 'Non-breaking hyphen', category: 'dash', replacement: '-' },
  '\u2012': { name: 'Figure dash', category: 'dash', replacement: '-' },
  '\u2015': { name: 'Horizontal bar', category: 'dash', replacement: '-' },

  // Invisible Spaces
  '\u00a0': { name: 'Non-breaking space', category: 'space', replacement: ' ' },
  '\u2009': { name: 'Thin space', category: 'space', replacement: ' ' },
  '\u200a': { name: 'Hair space', category: 'space', replacement: ' ' },
  '\u2002': { name: 'En space', category: 'space', replacement: ' ' },
  '\u2003': { name: 'Em space', category: 'space', replacement: ' ' },
  '\u2028': { name: 'Line separator', category: 'space', replacement: '\n' },
  '\u2029': {
    name: 'Paragraph separator',
    category: 'space',
    replacement: '\n\n'
  },
  '\u202f': {
    name: 'Narrow no-break space',
    category: 'space',
    replacement: ' '
  },
  '\u205f': {
    name: 'Medium mathematical space',
    category: 'space',
    replacement: ' '
  },
  '\u3000': { name: 'Ideographic space', category: 'space', replacement: ' ' },

  // Special Punctuation
  '\u2026': {
    name: 'Horizontal ellipsis',
    category: 'punctuation',
    replacement: '...'
  }
}
