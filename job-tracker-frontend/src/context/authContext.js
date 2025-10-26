import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/apiService'; // Import the pre-configured Axios instance

// --- 1. Create the Context ---
const AuthContext = createContext();

// --- 2. Custom Hook for easy access ---
// Any component can call const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

// --- 3. The Provider Component ---
export const AuthProvider = ({ children }) => {
  // State to hold the authenticated user and their token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true); // Tracks initial token verification

  // Runs once on component mount to check for an existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
        // If a token exists, try to fetch the current user to validate it
        // This relies on the apiService interceptor to automatically use the token
        const fetchUser = async () => {
            try {
                // Endpoint: GET /api/v1/auth/currentUser (Private)
                const response = await api.get('/auth/currentUser'); 
                setUser(response.data);
                setToken(storedToken);
            } catch (error) {
                // Token is invalid, expired, or user not found
                console.error('Token validation failed, logging out.', error);
                handleLogout(); // Force logout
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    } else {
        setIsLoading(false); // No token, stop loading
    }
  }, []);

  // --- Core Authentication Functions ---

  // Function to handle both user login
  const handleLogin = async ({ email, password }) => {
    try {
      // Endpoint: POST /api/v1/auth/login (Public)
      const response = await api.post('/auth/login', { email, password });
      
      const { token: newToken, ...userData } = response.data;
      
      // Store token and update state
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return response.data; // Return data for component feedback
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Throw error for the component to handle (e.g., display error message)
    }
  };

  // Function to handle user registration
  const handleRegister = async ({ name, email, password }) => {
    try {
      // Endpoint: POST /api/v1/auth/register (Public)
      const response = await api.post('/auth/register', { name, email, password });
      
      const { token: newToken, ...userData } = response.data;

      // Registration typically logs the user in immediately
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      return response.data; // Return data for component feedback
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    setUser(null);
    setToken(null);
    // Optional: Force reload to clear all state and redirect via Router
    window.location.href = '/login'; 
  };

  // The value exposed to consumers of the context
  const contextValue = {
    user,
    token,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  // Show a loading screen while checking the token
  if (isLoading) {
    // Simple centralized loading screen prevents unauthorized content flashes
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <h1 className="text-white text-2xl font-semibold">Loading Application...</h1>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
