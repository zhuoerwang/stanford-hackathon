import './App.css'
import { VoiceAgentPanel } from './components/VoiceAgentPanel'

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <a href="/" className="logo">
            <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M8 4c0 4 8 4 8 8s-8 4-8 8 8 4 8 8" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M24 4c0 4-8 4-8 8s8 4 8 8-8 4-8 8" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <circle cx="16" cy="8" r="2" fill="url(#logoGrad)"/>
              <circle cx="16" cy="16" r="2" fill="url(#logoGrad)"/>
              <circle cx="16" cy="24" r="2" fill="url(#logoGrad)"/>
            </svg>
            <span className="logo-text">TrialMatch</span>
          </a>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="main-content centered">
        <div className="main-container">
          <VoiceAgentPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-simple">
        <p>Data sourced from <a href="https://clinicaltrials.gov" target="_blank" rel="noopener noreferrer">ClinicalTrials.gov</a></p>
      </footer>
    </div>
  )
}

export default App
