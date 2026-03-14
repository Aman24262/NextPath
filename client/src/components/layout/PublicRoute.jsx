import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If a user is already logged in, redirect them away from the public page (Login/Register)
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If they are not logged in, allow them to view the page
  return children;
};

export default PublicRoute;
