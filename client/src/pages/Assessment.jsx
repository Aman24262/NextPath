import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Brain, CheckCircle, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const Assessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch the 15 questions from the database
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/assessment/questions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setQuestions(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load assessment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 2. Handle when a user clicks a 1-5 rating
  const handleAnswer = (rating) => {
    const currentQuestion = questions[currentStep];
    
    const newAnswers = [
      ...answers, 
      { 
        questionId: currentQuestion._id, 
        category: currentQuestion.category, 
        score: rating 
      }
    ];
    
    setAnswers(newAnswers);
    
    // Move to next question or submit if finished
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      submitAssessment(newAnswers);
    }
  };

  // 3. ✨ THE AI INTEGRATION ✨
  const submitAssessment = async (finalAnswers) => {
    setIsSubmitting(true);
    
    // Tally up the scores for each category
    const traitScores = {
      Analytical: 0, Creative: 0, Social: 0, Technical: 0, Management: 0
    };

    finalAnswers.forEach(ans => {
      if (traitScores[ans.category] !== undefined) {
        traitScores[ans.category] += ans.score;
      }
    });

    try {
      const token = localStorage.getItem('token');
      
      // Send the scores to your new AI Backend Route
      const response = await axios.post('http://localhost:5000/api/recommendations/generate', 
        { traitScores }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Success! The AI has returned the Top 3 Careers.
        // We navigate back to the dashboard and pass the AI's data along with it!
        navigate('/dashboard', { state: { aiResults: response.data.data } });
      }

    } catch (err) {
      console.error("AI Generation Error:", err);
      setError("The AI encountered an issue calculating your results. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading your personalized assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-50 text-red-500 p-4 text-center">
        <AlertCircle className="w-12 h-12 mb-4 mx-auto" />
        <p className="font-medium text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-2xl w-full">
        
        {/* Progress Bar */}
        {!isSubmitting && questions.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round((currentStep / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
          {isSubmitting ? (
            <div className="text-center py-12">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Analyzing Profile...</h2>
              <p className="text-slate-500 flex items-center justify-center gap-2 text-lg">
                <Loader2 className="w-5 h-5 animate-spin" />
                Gemini AI is generating your custom roadmap
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <Brain className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12 leading-relaxed">
                  "{questions[currentStep]?.text}"
                </h3>

                {/* 1-5 Rating Scale */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center gap-2 md:gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleAnswer(rating)}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-xl font-bold text-slate-600 hover:text-indigo-700 transition-all flex items-center justify-center hover:scale-110"
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
};

export default Assessment;