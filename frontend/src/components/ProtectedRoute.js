import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './Auth/AuthPage';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="bg-amber-50 border-4 border-amber-900 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-900 font-semibold">Loading Quest Tavern...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show auth page
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  // If authenticated, render the protected content
  return children;
}