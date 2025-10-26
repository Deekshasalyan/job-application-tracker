import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/authContext.js'; // This component holds user state

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Router allows us to define paths like /login and /dashboard */}
    <Router> 
      {/* AuthProvider wraps everything to provide authentication state */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
