import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Play } from 'lucide-react';

const HistoryModal = ({ history, onClose, onLoadResult }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Analysis History</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p>No previous analyses found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-slate-800/60 border border-slate-700 hover:border-primary/50 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between transition-colors group cursor-pointer"
                  onClick={() => {
                    onLoadResult(item.result, { name: item.filename, size: 0, type: 'audio/stored' });
                    onClose();
                  }}
                >
                  <div className="mb-3 sm:mb-0">
                    <h4 className="font-semibold text-slate-200 truncate max-w-[200px]">{item.filename}</h4>
                    <p className="text-xs text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-bold ${item.result.classification === 'Human' ? 'text-success' : 'text-error'}`}>
                        {item.result.classification}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{item.result.detectedLanguage || "Unknown"}</span>
                    </div>
                    
                    <button className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                       <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HistoryModal;
