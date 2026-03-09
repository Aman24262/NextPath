import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Map, ArrowLeft, Loader2, CheckCircle, Circle, BookOpen, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // This might be null if they just clicked "View Current Roadmap" from the dashboard
  const careerTitleFromState = location.state?.careerTitle || null;

  const [roadmap, setRoadmap] = useState(null); // Now stores the entire database object!
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrGenerateRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        let response;

        if (careerTitleFromState) {
          // Scenario 1: They clicked a specific career card. Ask AI to generate & save it.
          response = await axios.post(
            '/api/roadmaps/generate',
            { careerTitle: careerTitleFromState },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          // Scenario 2: They clicked "View Current Roadmap". Fetch the saved one!
          response = await axios.get(
            '/api/roadmaps/current',
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        if (response.data.success) {
          setRoadmap(response.data.data);
        }
      } catch (err) {
        console.error("Roadmap fetch error:", err);
        // If they get a 404, it means they haven't saved one yet!
        if (err.response && err.response.status === 404) {
           setError("You don't have an active roadmap yet. Head back and take the assessment!");
        } else {
           setError("Failed to load your roadmap. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateRoadmap();
  }, [careerTitleFromState]);

  const handleDownloadPDF = () => {
    window.print();
  };

  // ✨ THE MAGIC CHECKBOX FUNCTION ✨
  const toggleMilestone = async (phaseId, milestoneId) => {
    // 1. Instantly update the UI so it feels lightning fast to the user
    const updatedPhases = roadmap.phases.map(phase => {
        if (phase._id === phaseId) {
            return {
                ...phase,
                milestones: phase.milestones.map(m => {
                    if (m._id === milestoneId) {
                        return { ...m, completed: !m.completed }; // Flip the checkbox!
                    }
                    return m;
                })
            };
        }
        return phase;
    });

    setRoadmap({ ...roadmap, phases: updatedPhases });

    // 2. Silently send this update to your backend database!
    try {
        const token = localStorage.getItem('token');
        await axios.put(
            `/api/roadmaps/${roadmap._id}/milestone/${milestoneId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // ✨ THE SUCCESS TOAST NOTIFICATION
        toast.success('Progress saved!');
        
    } catch (err) {
        console.error("Failed to save progress to database", err);
        
        // ✨ THE ERROR TOAST NOTIFICATION
        toast.error('Failed to save progress. Check your connection.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {/* This creates a spinning animation on the Loader2 icon */}
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          AI is generating your custom roadmap...
        </h2>
        <p className="text-gray-500 mt-2">
          This usually takes a few seconds. Hang tight!
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <p className="font-medium text-lg mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="text-white bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 sm:p-8 bg-slate-50 relative">
      
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 print:hidden">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Download className="w-5 h-5" /> Download PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-50 p-4 md:p-8 rounded-2xl print:bg-white print:p-0">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 print:bg-indigo-50">
            <Map className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            The {roadmap.careerTitle} Roadmap
          </h1>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
            Your personalized curriculum. Click the circles to track your progress and level up your stats!
          </p>
        </div>

        {/* Timeline UI */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent print:before:bg-slate-300">
          {roadmap.phases.map((phase, index) => (
            <motion.div 
              key={phase._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active print:break-inside-avoid"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10 print:bg-indigo-100 print:text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                <h3 className="font-bold text-xl text-slate-900 mb-1">{phase.phase}</h3>
                <p className="text-indigo-600 text-sm font-medium mb-4">{phase.focus}</p>
                
                <ul className="space-y-3">
                  {phase.milestones.map((milestone) => (
                    <li 
                      key={milestone._id} 
                      onClick={() => toggleMilestone(phase._id, milestone._id)}
                      className="flex items-start gap-3 text-slate-600 cursor-pointer group/item hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                    >
                      {milestone.completed ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 shrink-0 group-hover/item:text-indigo-400 transition-colors" />
                      )}
                      <span className={`text-sm mt-0.5 transition-all ${milestone.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {milestone.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Roadmap;