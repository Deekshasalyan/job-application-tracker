import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Sidebar from './Sidebar'; // Import the Sidebar placeholder component

/**
 * @component ProtectedRoutes
 * @description A wrapper component that checks for user authentication. 
 * If authenticated, it renders the main app layout (Sidebar + Content via Outlet).
 * Otherwise, it redirects to the login page.
 */
const ProtectedRoutes = () => {
  const { user, isLoading } = useAuth(); // Get user state and loading status from context
  
  // 1. Show Loading Screen while the app checks for the token in localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <h1 className="text-white text-2xl font-semibold">Authorizing Access...</h1>
      </div>
    );
  }

  // 2. Security Check: If the user is NOT authenticated, redirect them
  if (!user) {
    // Navigate is a component that redirects the user to the specified path
    return <Navigate to="/login" replace />; 
  }

  // 3. If the user IS authenticated, render the main application layout
  return (
    // This div creates the main split layout (Sidebar and Main Content)
    <div className="flex h-screen bg-gray-100"> 
      <Sidebar /> {/* Renders the fixed navigation sidebar */}
      <main className="flex-1 overflow-y-auto"> {/* Main content area, scrolls if necessary */}
        <div className="p-4 sm:p-6 lg:p-8">
            <Outlet /> {/* Renders the current protected child route (Dashboard or Applications) */}
        </div>
      </main>
    </div>
  );
};

export default ProtectedRoutes;
