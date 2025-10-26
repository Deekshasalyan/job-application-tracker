import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext'; // Used for the initial loading state

// Public Pages
import AuthPage from './pages/AuthPage';

// Protected Components and Pages
import ProtectedRoutes from './components/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';

/**
 * @component App
 * @description The main component of the application, responsible for routing and global loading state.
 */
function App() {
  // Check the authentication loading state
  const { isLoading: isAuthLoading } = useAuth(); 

  // If the application is still checking the token on initial load, show the loading screen
  if (isAuthLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <h1 className="text-white text-2xl font-semibold">Loading Application...</h1>
        </div>
    );
  }
  
  return (
    <Routes>
      {/* 1. Public Routes (accessible to everyone) */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      
      {/* 2. Protected Routes (only accessible after login) */}
      <Route element={<ProtectedRoutes />}>
        {/* "/" is the default landing page after login */}
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/applications" element={<Applications />} />
      </Route>

      {/* 3. Catch-all route for 404 - Redirects to the Dashboard or Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
