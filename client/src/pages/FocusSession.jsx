import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Play, Pause, RotateCcw, CheckCircle, Brain, ArrowLeft, Loader2 } from 'lucide-react';

const FocusSession = () => {
  const navigate = useNavigate();
  
  // Timer state: Default is 25 minutes (1500 seconds)
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // The actual countdown logic
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer hit zero!
      setIsActive(false);
      setIsFinished(true);
      saveSessionData();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Format the seconds into MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Controls
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(1500); // Reset back to 25 mins
    setIsFinished(false);
  };

  // Secret Dev Tool: Instantly set timer to 3 seconds to test the database save!
  const triggerDevTest = () => {
    setIsActive(false);
    setTimeLeft(3);
  };

  // Save the successful session to the database
  const saveSessionData = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      // We will reuse your existing stats route to boost their Focus Score!
      await axios.put('http://localhost:5000/api/users/stats', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Send them back to the dashboard after 3 seconds to see their new score
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error("Failed to save session:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-slate-50 relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-10 text-center relative overflow-hidden">
          
          {isFinished ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="py-8"
            >
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Session Complete!</h2>
              <p className="text-slate-500 mb-8">Incredible focus. Your stats are being updated.</p>
              {isSaving && (
                <p className="text-indigo-600 flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving to database...
                </p>
              )}
            </motion.div>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Deep Work Session</h2>
                <p className="text-slate-500 text-sm mt-1">Eliminate all distractions.</p>
              </div>

              {/* The Timer Display */}
              <motion.div 
                key={displayTime}
                className="text-7xl font-black text-slate-900 tracking-tighter mb-10 tabular-nums"
              >
                {displayTime}
              </motion.div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={toggleTimer}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'}`}
                >
                  {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                
                <button 
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Secret Dev Button for Testing */}
              <button 
                onClick={triggerDevTest}
                className="mt-12 text-xs font-semibold text-slate-300 hover:text-indigo-400 transition-colors uppercase tracking-wider"
              >
                [ Dev: Test 3s Timer ]
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default FocusSession;