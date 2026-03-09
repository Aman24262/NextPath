import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust path if needed (e.g., '../context/AuthContext')
import { Brain, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- Left Side: Logo --- */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="flex items-center">
          <img
            src="/logo.png"
            alt="NextPath Logo"
            className="h-20 w-auto object-contain"
          />
        </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              NextPath
            </span>
          </Link>

          {/* --- Right Side: Links & Profile --- */}
          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <>
                {/* Standard Links (Hidden on very small mobile screens) */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                  <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Profile Settings
                  </Link>
                  
                  {/* CONDITIONAL: Admin Panel Link */}
                  {/* This will ONLY show up if the user's role is 'Admin' */}
                  {user.role === 'Admin' && (
                    <Link to="/admin" className="text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors">
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                </div>

                {/* Profile Avatar & Name */}
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6 ml-2">
                  <img 
                    src={user?.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=e0e7ff&color=4f46e5`} 
                    alt="Profile Avatar" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                  />
                  <span className="font-semibold text-slate-700 hidden sm:block text-sm">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors ml-2"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Logged Out Links (For when they are on the Login page) */}
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;