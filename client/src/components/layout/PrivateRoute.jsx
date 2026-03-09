import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react'; // Reusing the spinner from your login page!

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. Prevent flickering while AuthContext checks Local Storage on page refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. The Bouncer: If there is no user, redirect to login
  if (!user) {
    // 'replace' prevents them from hitting the back button to return to the protected page
    return <Navigate to="/login" replace />; 
  }

  // 3. VIP Access: If they are logged in, render the page they asked for
  return children;
};

export default PrivateRoute;