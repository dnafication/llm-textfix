import { GitHubIcon } from './GitHubIcon'

export const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 text-center relative">
      <div className="absolute top-4 right-4 z-10">
        <a
          href="https://github.com/dnafication/llm-textfix"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/20 hover:scale-105 relative z-10"
          title="View source code on GitHub"
        >
          <GitHubIcon className="w-5 h-5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
      <h1 className="text-white text-2xl md:text-4xl font-bold tracking-wide drop-shadow-lg">
        LLM TextFix
      </h1>
      <p className="text-blue-100 mt-2 text-base md:text-lg">
        Sanitize LLM output by detecting and replacing 25+ problematic characters
      </p>
    </div>
  )
}
