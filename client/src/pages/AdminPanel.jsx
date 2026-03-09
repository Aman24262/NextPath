import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, Shield, Loader2, TrendingUp, Target, Mail } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all users when the page loads
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setAllUsers(response.data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'Admin') {
      fetchAllUsers();
    }
  }, [user]);

  // SECURITY: If a regular student tries to type /admin in the URL, kick them back to the dashboard!
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Admin Control Panel
          </h1>
          <p className="text-slate-500 mt-2">
            Overview of all {allUsers.length} registered PeakMindset45 students.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="p-4 pl-6">Student</th>
                <th className="p-4">Education</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Current Streak</th>
                <th className="p-4 text-center">Focus Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  
                  <td className="p-4 pl-6 flex items-center gap-4">
                    <img 
                      src={u.profile?.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=e0e7ff&color=4f46e5`} 
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {u.email}
                      </p>
                    </div>
                  </td>
                  
                  <td className="p-4 text-sm text-slate-600">
                    {u.profile?.educationLevel || 'Not set'}
                    {u.profile?.stream && <span className="block text-xs text-slate-400">{u.profile.stream}</span>}
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-slate-700">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      {u.stats?.currentStreak || 0}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-slate-700">
                      <Target className="w-4 h-4 text-amber-500" />
                      {u.stats?.focusScore || 0}%
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default AdminPanel;