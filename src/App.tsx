import { useState, useMemo } from 'react'
import './space-indicator.css'

const PROBLEMATIC_CHARS: Record<
  string,
  { name: string; category: string; replacement: string }
> = {
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
  '\u2013': { name: 'En dash', category: 'dash', replacement: '-' },
  '\u2014': { name: 'Em dash', category: 'dash', replacement: '-' },
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
  '\u2026': {
    name: 'Horizontal ellipsis',
    category: 'punctuation',
    replacement: '...'
  },
  '\u2010': { name: 'Hyphen', category: 'dash', replacement: '-' },
  '\u2011': { name: 'Non-breaking hyphen', category: 'dash', replacement: '-' },
  '\u2012': { name: 'Figure dash', category: 'dash', replacement: '-' },
  '\u2015': { name: 'Horizontal bar', category: 'dash', replacement: '-' },
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
  }
}

function App() {
  const [text, setText] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const getHighlightClasses = (category: string) => {
    const baseClasses =
      'relative font-bold rounded px-1 py-0.5 cursor-help border'
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

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const highlightedText = useMemo(() => {
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
  }, [text])

  const replaceProblematicChars = () => {
    let cleanedText = text
    for (const [char, info] of Object.entries(PROBLEMATIC_CHARS)) {
      cleanedText = cleanedText.replaceAll(char, info.replacement)
    }
    setText(cleanedText)
  }

  const problematicCharCount = useMemo(() => {
    let count = 0
    for (let i = 0; i < text.length; i++) {
      if (text[i] in PROBLEMATIC_CHARS) {
        count++
      }
    }
    return count
  }, [text])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)

      // Reset the button text after 5 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 5000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const loadExampleText = () => {
    const exampleText = `Here's an example of problematic LLM output:

“Hello world!” said the AI, using smart quotes.
‘Single quotes’ are also problematic.

Dashes and spaces:
- En dash: – (used in ranges like 2023–2024)
- Em dash: — (used for emphasis — like this)
- Non-breaking space: [there's one here] between words
- Thin space: [very thin space] barely visible
- Em space: [wide space] much wider

Special punctuation:
- Horizontal ellipsis: … (three dots)
- Various hyphens: ‐ ‑ ‒ ―

Angle quotes:
- French quotes: « guillemets »
- Single angles: ‹ example ›

Low quotes:
- Single low: ‚example
- Double low: „example

HTML test: <script>alert('test')</script> & other < > symbols.

This text contains different types of problematic characters that LLMs commonly output!`

    setText(exampleText)
  }

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <h1 className="text-center mb-8 text-gray-800 text-3xl font-semibold">
        LLM Character Highlighter
      </h1>

      <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex gap-4">
          <span className="text-sm text-slate-600 font-medium">
            Characters: {text.length.toLocaleString()}
          </span>
          <span className="text-sm text-red-600 font-semibold">
            Problematic: {problematicCharCount}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadExampleText}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all border-0 cursor-pointer bg-gray-600 text-white hover:bg-gray-700"
          >
            Load Example
          </button>
          <button
            onClick={replaceProblematicChars}
            disabled={problematicCharCount === 0}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all border-0 cursor-pointer bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Replace Problematic Characters
          </button>
          <button
            onClick={copyToClipboard}
            disabled={text.length === 0 || isCopied}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all border-0 cursor-pointer ${
              isCopied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isCopied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text here or click 'Load Example' to see problematic characters..."
        className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-lg text-sm leading-6 resize-y mb-6 transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <div className="">
        <h3 className="mb-3 text-gray-700 text-lg font-semibold">
          Highlighted Output:
        </h3>
        <div
          className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm leading-6 whitespace-pre-wrap break-all min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>
    </div>
  )
}

export default App
