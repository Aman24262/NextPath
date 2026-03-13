import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Context Provider (The "Brain" of your auth system)
import { AuthProvider } from './context/AuthContext';

// 2. Layout & Protection Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute.jsx';

// 3. Public Pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import OAuthCallback from './pages/public/OAuthCallback'; // <-- NEW: Import OAuth Callback

// 4. Protected Pages
// Note: Adjust this import path if your Dashboard is in a different folder!

import Dashboard from './pages/Dashboard';

import Profile from './pages/Profile'; // <-- NEW: Import the Profile page

import Assessment from './pages/Assessment'; // <-- NEW: Import the Assessment page

import AdminPanel from './pages/AdminPanel'; // <-- NEW: Import the Admin Panel page

import FocusSession from './pages/FocusSession'; // <-- NEW: Import the Focus Session page

import Roadmap from './pages/Roadmap'; // <-- NEW: Import the Roadmap page

import { Toaster } from 'react-hot-toast';
 
function App() {
  return (

    
    // Wrap the entire app in AuthProvider so every component can check if a user is logged in
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        {/* Navbar sits outside Routes so it remains visible on every page */}
        <Navbar />
        
        <main className="min-h-[calc(100vh-64px)] bg-slate-50">
          <Routes>
            {/* 🔓 Public Routes (Anyone can access) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />

            {/* 🔒 Protected Routes (Locked behind the Bouncer) */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            <Route path="/focus" element={<PrivateRoute><FocusSession /></PrivateRoute>} />

            <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />

            <Route 
              path="/assessment" 
              element={
                <PrivateRoute>
                  <Assessment />
                </PrivateRoute>
              } 
            />

            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />

            {/* Catch-all route: If they type a random URL or just '/', send them to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;