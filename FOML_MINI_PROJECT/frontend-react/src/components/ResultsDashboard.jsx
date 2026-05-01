import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Globe2, Activity, Play, Download, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ResultsDashboard = ({ result, audioFile }) => {
  if (!result) return null;

  const isHuman = result.classification.toLowerCase() === 'human';
  
  const chartData = [
    { name: 'Human', prob: parseFloat((result.humanProbability * 100).toFixed(1)) },
    { name: 'AI Gen', prob: parseFloat((result.aiProbability * 100).toFixed(1)) }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Voice Analysis Result',
          text: `My voice was analyzed as ${result.classification} (${(result.confidenceScore * 100).toFixed(1)}% confidence) speaking ${result.detectedLanguage}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(`My voice was analyzed as ${result.classification} speaking ${result.detectedLanguage}!`);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 w-full max-w-5xl mx-auto mb-20"
      id="results"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Analysis Results</h2>
        <div className="flex space-x-3">
          <button onClick={handleShare} className="flex items-center space-x-2 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors border border-slate-700">
            <Share2 className="w-4 h-4" /> <span>Share</span>
          </button>
          <button onClick={handlePrint} className="flex items-center space-x-2 text-sm bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1.5 rounded-md transition-colors border border-primary/30">
            <Download className="w-4 h-4" /> <span>PDF Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Classification Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Voice Authenticity</h3>
            <div className={`text-3xl font-bold flex items-center space-x-2 ${isHuman ? 'text-success' : 'text-error'}`}>
               {isHuman ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
               <span>{result.classification}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">
               Confidence Score: <span className="font-mono text-white">{(result.confidenceScore * 100).toFixed(2)}%</span>
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-400 leading-relaxed">
              {result.explanation || "Analyzed utilizing acoustic features (ZCR, RMS, Pitch)."}
            </p>
          </div>
        </div>

        {/* Language Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Detected Language</h3>
            <div className="text-3xl font-bold flex items-center space-x-2 text-blue-400">
               <Globe2 className="w-8 h-8" />
               <span className="capitalize">{result.detectedLanguage || "Unknown"}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">
               Extracted directly from Whisper multi-lingual speech transcription.
            </p>
          </div>
        </div>

        {/* Confidence Metrics Chart Card */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-slate-400 text-sm font-medium mb-4">Probability Distribution</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={50} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Probability']}
                />
                <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Human' ? 'var(--color-success)' : 'var(--color-error)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transcription and Audio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transcription */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
             <Activity className="w-5 h-5 text-primary" />
             <h3 className="text-lg font-semibold">Speech Transcript</h3>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 min-h-[100px]">
             <p className="text-slate-300 italic leading-relaxed text-lg">
                "{result.transcript || "No discernible speech detected."}"
             </p>
          </div>
        </div>

        {/* Audio Meta */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Audio Insights</h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
               <span className="text-slate-400 text-sm">File Name</span>
               <span className="text-sm font-medium truncate max-w-[120px]" title={audioFile?.name}>
                 {audioFile?.name || "live_recording.webm"}
               </span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
               <span className="text-slate-400 text-sm">Size</span>
               <span className="text-sm font-medium">
                 {audioFile ? (audioFile.size / 1024).toFixed(1) + " KB" : "--"}
               </span>
             </div>
             <div className="flex justify-between items-center py-2">
               <span className="text-slate-400 text-sm">Format</span>
               <span className="text-sm font-medium uppercase">
                 {audioFile?.type.split('/')[1] || "Audio"}
               </span>
             </div>
             {/* Mini generic audio player */}
             {audioFile && (
               <div className="mt-4">
                 <audio controls src={URL.createObjectURL(audioFile)} className="w-full h-10 outline-none" />
               </div>
             )}
          </div>
        </div>

      </div>

    </motion.section>
  );
};

export default ResultsDashboard;
