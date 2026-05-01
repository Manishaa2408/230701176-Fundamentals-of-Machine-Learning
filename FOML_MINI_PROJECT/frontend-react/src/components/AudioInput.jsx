import React, { useCallback, useState, useRef, useEffect } from 'react';
import { UploadCloud, Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioInput = ({ onAnalyze, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Handle Drag Events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
  };

  const handleManualUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], 'live_recording.webm', { type: 'audio/webm' });
        setSelectedFile(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <section className="px-4 w-full max-w-3xl mx-auto mb-10" id="analyze">
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
        
        {/* Loader Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Analyzing voice patterns...
              </h3>
              <p className="text-sm text-slate-400 mt-2">Running through deep learning models</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer hover:border-primary/50 hover:bg-slate-800/50 ${dragActive ? 'border-primary bg-primary/10' : 'border-slate-600'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept="audio/*" 
              onChange={handleManualUpload} 
            />
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 shadow-inner">
              <UploadCloud className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Drag & Drop Audio</h3>
            <p className="text-xs text-slate-400">Supported: MP3, WAV, WebM, OGG (Max 25MB)</p>
          </div>

          {/* Record Area */}
          <div className="border-2 border-solid border-slate-700/50 bg-slate-800/30 rounded-xl p-8 text-center flex flex-col items-center justify-center">
            
            {isRecording ? (
               <div className="flex flex-col items-center">
                 <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4 relative">
                   <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75 pointer-events-none"></div>
                   <button 
                     onClick={stopRecording}
                     type="button"
                     className="relative z-10 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg shadow-red-500/50 text-white cursor-pointer"
                   >
                     <Square className="w-6 h-6 fill-current" />
                   </button>
                 </div>
                 <h3 className="font-medium text-red-400 mb-1">Recording Live...</h3>
                 <p className="text-sm font-mono text-red-300">{formatTime(recordingTime)}</p>
               </div>
            ) : (
              <div className="flex flex-col items-center cursor-pointer group" onClick={startRecording}>
                <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-primary border border-slate-600 group-hover:border-primary flex items-center justify-center mb-4 transition-all shadow-inner group-hover:shadow-primary/30">
                  <Mic className="w-8 h-8 text-slate-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Record Live Audio</h3>
                <p className="text-xs text-slate-400">Click to start your microphone</p>
              </div>
            )}
            
          </div>
        </div>

        {/* Selected File Box */}
        {selectedFile && !isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700"
          >
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-primary/20 p-2 rounded mr-3">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-200 truncate max-w-[200px] md:max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-primary hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50"
            >
              Analyze Now
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AudioInput;
