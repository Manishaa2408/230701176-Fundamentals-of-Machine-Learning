import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AudioInput from './components/AudioInput'
import ResultsDashboard from './components/ResultsDashboard'
import AboutModal from './components/AboutModal'
import HistoryModal from './components/HistoryModal'
import { analyzeAudio } from './services/api'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const [isDark, setIsDark] = useState(true)
  const [showAbout, setShowAbout] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('voice_history')
    return saved ? JSON.parse(saved) : []
  })

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('voice_history', JSON.stringify(history))
  }, [history])

  // Sync theme to root html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  const handleLoadHistoryResult = (itemResult, itemFile) => {
    setResult(itemResult)
    setCurrentFile(itemFile)
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  const handleAnalyze = async (file) => {
    setIsLoading(true)
    setResult(null)
    setErrorMsg(null)
    setCurrentFile(file)
    
    try {
      const startTime = Date.now();
      const response = await analyzeAudio(file, file.name || "recording.webm");
      const elapsed = Date.now() - startTime;
      
      if (elapsed < 1500) {
        await new Promise(res => setTimeout(res, 1500 - elapsed));
      }
      
      setResult(response);
      setHistory(prev => [{ 
        result: response, 
        filename: file.name || "recording.webm", 
        timestamp: new Date().toISOString() 
      }, ...prev]);
      
      // smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onOpenHistory={() => setShowHistory(true)} 
        onOpenAbout={() => setShowAbout(true)} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="flex-1 w-full mx-auto pb-16">
        <Hero />
        
        <AudioInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto mb-10 bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-center"
            >
              <p className="text-red-400 font-medium">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <ResultsDashboard result={result} audioFile={currentFile} />
          )}
        </AnimatePresence>
        
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-800">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} AI Voice Analyzer. Advanced Speech Forensics.
        </p>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {showHistory && (
          <HistoryModal 
            history={history} 
            onClose={() => setShowHistory(false)} 
            onLoadResult={handleLoadHistoryResult} 
          />
        )}
      </AnimatePresence>

    </div>
  )
}

export default App
