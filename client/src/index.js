import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// In development, the frontend and backend servers are separate so we need to
// call a route to add the CSRF token cookie to the frontend only in development
if (process.env.NODE_ENV !== 'production') {
  const getCSRFToken = () => {
    return fetch("/api/csrf/token");
  };

  getCSRFToken();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
