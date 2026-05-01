import React from 'react';
import { motion } from 'framer-motion';
import { X, Mic2, ShieldCheck, Globe2 } from 'lucide-react';

const AboutModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden relative shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-primary/20 p-3 rounded-xl text-primary">
              <Mic2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AI Voice Analyzer
            </h2>
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              The AI Voice Analyzer is an advanced acoustic forensics tool designed to accurately filter human vs. artificially generated voices utilizing deep neural networks.
            </p>
            
            <div className="flex items-start space-x-3">
               <ShieldCheck className="w-6 h-6 text-success shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-semibold text-white mb-1">Authenticity Detection</h4>
                  <p className="text-sm">We extract Zero Crossing Rates, Root Mean Squares, and Pitch variance to map frequency distributions against known AI models.</p>
               </div>
            </div>

            <div className="flex items-start space-x-3">
               <Globe2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-semibold text-white mb-1">Worldwide Languages</h4>
                  <p className="text-sm">Powered natively by OpenAI's Whisper model, we seamlessly detect over 99 languages globally in real-time, requiring zero manual configuration.</p>
               </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
             <p className="text-xs text-slate-500">Built for robust AI security & speech identification.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutModal;
