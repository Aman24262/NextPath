import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  // Framer Motion variant for staggering the animation of child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delays each child animation by 0.2s
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      
      {/* Background Glowing Gradients for that "Modern SaaS" look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Small AI Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm border border-indigo-200 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Career Intelligence</span>
          </div>
        </motion.div>

        {/* Massive Headline */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Find Your Perfect Path with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
              Precision & Data.
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing. Take our psychological assessment, get matched with high-growth tech careers, and receive a personalized AI-generated learning roadmap in seconds.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-200">
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
            Explore Careers
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;