import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Define the navigation links
const navLinks = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Applications', path: '/applications', icon: '📋' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

/**
 * @component Sidebar
 * @description The main navigation component for authenticated users.
 */
const Sidebar = () => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();

  // Helper function to apply styling based on the active path
  const getLinkClass = (path) => {
    const baseClasses = "flex items-center p-3 rounded-xl transition duration-200 hover:bg-sky-700 font-medium";
    const isActive = location.pathname === path;
    
    return isActive
      ? `${baseClasses} bg-sky-600 text-white shadow-lg shadow-sky-900/50`
      : `${baseClasses} text-slate-300 hover:text-white`;
  };

  return (
    // Fixed sidebar with gradient background
    <div className="hidden lg:flex flex-col w-64 bg-gradient-to-br from-slate-900 to-sky-900 text-white p-6 h-screen sticky top-0 shadow-2xl">
      
      {/* App Title */}
      <h1 className="text-3xl font-extrabold mb-10 text-sky-400 border-b border-sky-800 pb-3">
        Job Tracker Pro
      </h1>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 flex-grow">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={getLinkClass(link.path)}
            end={link.path === "/"} // 'end' ensures / only matches /
          >
            <span className="text-xl mr-3">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User & Logout */}
      <div className="pt-6 border-t border-sky-800">
        <div className="flex items-center mb-4 p-3 rounded-xl bg-slate-800">
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold text-lg mr-3">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
            </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full text-left flex items-center p-3 rounded-xl text-red-400 transition duration-200 hover:bg-red-900 hover:text-white font-medium"
        >
          <span className="text-xl mr-3">🚪</span>
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
