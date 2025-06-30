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
      }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 text-center relative">
            <div className="absolute top-4 right-4">
              <a
                href="https://github.com/dnafication/llm-textfix"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/20 hover:scale-105"
                title="View source code on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
            <h1 className="text-white text-2xl md:text-4xl font-bold tracking-wide drop-shadow-lg">
              LLM TextFix
            </h1>
            <p className="text-blue-100 mt-2 text-base md:text-lg">
              Sanitize LLM output by detecting and replacing 25+ problematic
              characters
            </p>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-8">
            {/* Controls Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 p-6 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl shadow-lg gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="bg-white px-4 py-2 rounded-lg shadow-md border flex-1 text-center">
                  <span className="text-sm text-slate-600 font-medium">
                    Characters:
                  </span>
                  <span className="text-sm text-slate-800 font-bold ml-2">
                    {text.length.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-md border flex-1 text-center">
                  <span className="text-sm text-slate-600 font-medium">
                    Problematic:
                  </span>
                  <span className="text-sm text-red-600 font-bold ml-2">
                    {problematicCharCount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={loadExampleText}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-0 cursor-pointer bg-gray-600 text-white hover:bg-gray-700 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Sample Text
                </button>
                <button
                  onClick={replaceProblematicChars}
                  disabled={problematicCharCount === 0}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-0 cursor-pointer bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
                >
                  Replace
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={text.length === 0 || isCopied}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-0 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 ${
                    isCopied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-8">
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                Input Text:
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste text here or click 'Sample Text' to see problematic characters..."
                className="w-full min-h-[200px] p-6 border-2 border-gray-300 rounded-xl text-sm leading-6 resize-y transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-lg focus:shadow-xl bg-white"
              />
            </div>

            {/* Output Section */}
            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                Highlighted Output:
              </label>
              <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div
                  className="p-6 bg-gradient-to-br from-gray-50 to-white text-sm leading-6 whitespace-pre-wrap break-all min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
