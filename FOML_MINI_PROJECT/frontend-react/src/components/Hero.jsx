import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Mic } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-20 pb-10 px-4 max-w-4xl mx-auto text-center" id="home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          Advanced Audio Forensics & AI
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Detect AI Voices & Identify Languages <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Instantly</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
          Upload or record audio on the fly. Let our deep learning model analyze speech authenticity and precisely detect spoken languages within seconds.
        </p>

      </motion.div>
    </section>
  );
};

export default Hero;
