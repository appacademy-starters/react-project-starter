import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);

  // Check to see if there is a user logged in before loading the application
  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/session");
      if (res.ok) {
        res.data = await res.json(); // current user info
        console.log(res.data);
        // if using Redux, add current user info to the store
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Route path="/">
        <h1>My Home Page</h1>
      </Route>
    </BrowserRouter>
  );
}

export default App;
