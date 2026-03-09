import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, Zap, Clock, Briefcase, 
  ChevronRight, BrainCircuit, Sparkles, Map 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grab the AI results if they just finished the assessment!
  const aiRecommendations = location.state?.aiResults || null;

  // ✨ NEW: State to hold the active roadmap
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  // ✨ NEW: Fetch the roadmap when the Dashboard loads
  useEffect(() => {
    const fetchRoadmapStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/roadmaps/current', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const roadmap = response.data.data;
          setActiveRoadmap(roadmap);

          // Calculate how many milestones are checked green
          let count = 0;
          roadmap.phases.forEach(phase => {
            phase.milestones.forEach(m => {
              if (m.completed) count++;
            });
          });
          setCompletedCount(count);
        }
      } catch (error) {
        console.log("User hasn't generated a roadmap yet.");
      }
    };

    fetchRoadmapStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-slate-500 mt-2">
            Let's build your career roadmap and level up your skills today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: AI Career Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Your Top Career Matches</h2>
          </div>

          {aiRecommendations ? (
            <div className="space-y-4">
              {aiRecommendations.map((career, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {career.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                          <BrainCircuit className="w-4 h-4" /> {career.difficulty}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                          <Clock className="w-4 h-4" /> {career.estimatedLearningTime}
                        </span>
                      </div>
                    </div>
                    
                    {/* Match Percentage Badge */}
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-2 rounded-xl flex items-center gap-2 font-bold">
                      <Target className="w-5 h-5 text-emerald-500" />
                      {career.matchPercentage}% Match
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                    "{career.reason}"
                  </p>

                  <button 
                    onClick={() => navigate('/roadmap', { state: { careerTitle: career.title } })}
                    className="text-indigo-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    View Roadmap <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            // If they haven't taken the test yet, or just logged in normally
            <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center">
              <BrainCircuit className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-indigo-900 mb-2">No active recommendations</h3>
              <p className="text-indigo-600/80 mb-6 max-w-md mx-auto">
                Take the AI Career Assessment to analyze your skills and discover your top 3 perfect career paths.
              </p>
              <button 
                onClick={() => navigate('/assessment')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Take Assessment Now
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Progress Tracking */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-200">
              <Trophy className="w-5 h-5 text-amber-400" />
              Learning Progress
            </h2>
            
            <div className="space-y-6">
              {/* Learning Completion */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                  <span>Learning Completion</span>
                  {/* ✨ NEW: Read the percentage from the database! */}
                  <span className="text-white font-bold">{activeRoadmap?.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  {/* ✨ NEW: Fill the bar based on the database! */}
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${activeRoadmap?.completionPercentage || 0}%` }}></div>
                </div>
              </div>

              {/* Milestones Reached */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                <div className="text-slate-400 text-sm font-medium mb-1">Milestones Reached</div>
                <div className="text-3xl font-bold flex items-baseline gap-2">
                  {/* ✨ NEW: Read the counted checkmarks from the database! */}
                  {completedCount} <span className="text-sm text-slate-400 font-medium">skills learned</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => navigate('/roadmap')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 border border-indigo-400 text-white font-medium py-3 px-4 rounded-xl transition-all text-left flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 opacity-80" />
                  View Current Roadmap
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;