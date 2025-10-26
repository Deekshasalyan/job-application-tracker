import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 

const AuthPage = () => {
  // --- Global State and Hooks ---
  const { user, login, register, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // --- Local State ---
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading for form submission

  // --- Effect for Redirection ---
  // If the user is already authenticated, redirect them to the dashboard
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // If the initial token check is still running, show loading
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <h1 className="text-xl font-semibold text-gray-700">Checking Session...</h1>
      </div>
    );
  }

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Registering requires name, email, and password
        await register(formData);
      } else {
        // Logging in requires email and password
        await login({ email: formData.email, password: formData.password });
      }
    } catch (err) {
      // Handle the error thrown from authContext
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Render ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-6">
          {isRegistering ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          {isRegistering ? 'Start tracking your job applications today.' : 'Sign in to continue your job search journey.'}
        </p>

        {/* --- Error Display --- */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* --- Name Field (Only for Register) --- */}
          {isRegistering && (
            <div className="relative">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required={isRegistering}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
              />
            </div>
          )}

          {/* --- Email Field --- */}
          <div className="relative">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
          </div>

          {/* --- Password Field --- */}
          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
          </div>

          {/* --- Submit Button --- */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 shadow-md ${
              isLoading
                ? 'bg-sky-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 shadow-sky-300/50'
            }`}
          >
            {isLoading ? (isRegistering ? 'Registering...' : 'Logging In...') : isRegistering ? 'Register' : 'Log In'}
          </button>
        </form>

        {/* --- Toggle Link --- */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-sky-600 hover:text-sky-800 transition duration-150"
          >
            {isRegistering
              ? 'Already have an account? Log In'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
