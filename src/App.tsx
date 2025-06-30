import { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { useClipboard } from './hooks/useClipboard'
import { 
  countProblematicChars, 
  replaceProblematicChars, 
  generateHighlightedHtml 
} from './utils/textUtils'
import { SAMPLE_TEXT } from './data/sampleText'
import './space-indicator.css'

function App() {
  const [text, setText] = useState('')
  const { isCopied, copyToClipboard } = useClipboard(3000)

  // Memoized calculations
  const highlightedText = useMemo(() => generateHighlightedHtml(text), [text])
  const problematicCharCount = useMemo(() => countProblematicChars(text), [text])

  // Event handlers
  const handleReplaceCharacters = () => {
    setText(replaceProblematicChars(text))
  }

  const handleCopyToClipboard = () => {
    copyToClipboard(text)
  }

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <Header />

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
                  onClick={handleLoadSample}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-0 cursor-pointer bg-gray-600 text-white hover:bg-gray-700 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Load Sample
                </button>
                <button
                  onClick={handleReplaceCharacters}
                  disabled={problematicCharCount === 0}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-0 cursor-pointer bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
                >
                  Replace
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  disabled={text.length === 0 || isCopied}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-0 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 ${
                    isCopied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
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
                placeholder="Paste text here or click 'Load Sample' to see problematic characters..."
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
