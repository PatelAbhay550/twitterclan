import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import TweetForm from "./components/TweetForm";
import Timeline from "./components/Timeline";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import UserProfile from "./components/UserProfile";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/timeline" /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/timeline"
          element={user ? <Timeline user={user} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/tweet"
          element={user ? <TweetForm user={user} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile/:userId"
          element={user ? <UserProfile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/Profile"
          element={user ? <Profile user={user} /> : <Navigate to="/auth" />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
