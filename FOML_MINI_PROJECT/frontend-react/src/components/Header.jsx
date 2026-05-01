import React from 'react';
import { Mic2, Moon, Sun, History, Info, Home } from 'lucide-react';

const Header = ({ onOpenHistory, onOpenAbout, isDark, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 w-full">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Mic2 className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Voice Analyzer
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#" className="flex items-center space-x-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a href="#analyze" className="flex items-center space-x-1 hover:text-primary transition-colors">
            <Mic2 className="w-4 h-4" />
            <span>Analyze Audio</span>
          </a>
          <button onClick={onOpenHistory} className="flex items-center space-x-1 hover:text-primary transition-colors">
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
          <button onClick={onOpenAbout} className="flex items-center space-x-1 hover:text-primary transition-colors">
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>
        </nav>

        {/* Try out button */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="text-slate-300 hover:text-primary transition-colors p-2 bg-slate-800 rounded-full border border-slate-700">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-200" />}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
