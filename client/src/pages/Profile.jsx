import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Zap, 
  Target, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  
  // 1. Form State (Now includes 'avatar')
  const [formData, setFormData] = useState({
    avatar: '',
    educationLevel: 'Undergraduate',
    stream: '',
    skills: '', 
    goals: ''
  });

  // 2. UI Status State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 3. Fetch current profile data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.profile) {
          const { avatar, educationLevel, stream, skills, goals } = response.data.profile;
          setFormData({
            avatar: avatar || '',
            educationLevel: educationLevel || 'Undergraduate',
            stream: stream || '',
            // Convert the array of skills from the database into a comma-separated string
            skills: skills ? skills.join(', ') : '',
            goals: goals || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 4. Handle standard text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear any success/error messages when the user starts typing again
    setMessage({ type: '', text: '' }); 
  };

  // 5. Handle Image Upload & Convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB to save database space)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 2MB.' });
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
        setMessage({ type: '', text: '' }); 
      };
    }
  };

  // 6. Submit updated data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      // Convert the comma-separated string back into a clean Array for MongoDB
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const dataToSend = {
        ...formData,
        skills: skillsArray
      };

      const response = await axios.put('/api/users/profile', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });

        if (setUser) {
          setUser((prevUser) => ({
            ...prevUser,
            profile: response.data.profile
          }));
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-indigo-600" />
          Profile Settings
        </h1>
        <p className="text-slate-500 mt-2">
          Update your academic details and goals to personalize your PeakMindset45 experience.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Status Message */}
        {message.text && (
          <div className={`p-4 flex items-center gap-3 border-b ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* --- Avatar Upload Section --- */}
          <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              {/* The Circular Image */}
              <img 
                src={formData.avatar || 'https://ui-avatars.com/api/?name=User&background=e0e7ff&color=4f46e5'} 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-indigo-50"
              />
              {/* The Upload Button */}
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer text-white hover:bg-indigo-700 transition-colors shadow-sm">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Profile Picture</h3>
              <p className="text-sm text-slate-500 mt-1">Click the camera icon to upload.<br/>Square images under 2MB work best.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                Education Level
              </label>
              <select 
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 hover:bg-white"
              >
                <option value="10th">10th Standard</option>
                <option value="12th">12th Standard</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* Stream */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                Academic Stream
              </label>
              <input 
                type="text" 
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                placeholder="e.g., Computer Science, Commerce, Arts"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 hover:bg-white"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-400" />
              Your Skills
            </label>
            <input 
              type="text" 
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Public Speaking (separate with commas)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 hover:bg-white"
            />
            <p className="text-xs text-slate-500 mt-2">Separate multiple skills using commas.</p>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" />
              Primary Goals
            </label>
            <textarea 
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              rows="4"
              placeholder="What are you trying to achieve with PeakMindset45?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 hover:bg-white resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default Profile;