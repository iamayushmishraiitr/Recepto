import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./LoginScreen.css";

const LoginScreen: React.FC = () => {
  const { login } = useAppContext();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    if (!username) {
      setError("Please enter a username.");
      return;
    }
    const success = login(username);
    if (!success) {
      setError('Invalid username. Try "Anand Kumar" or "Olivia Rhye".');
      // Keep the form visible
    }
    // On success, the App component will re-render due to context change
  };

  return (
    <div className="login-overlay">
      <div className="login-box card">
        <img src="/logo.svg" alt="Recepto" className="login-logo" />
        <h2>Welcome to Recepto</h2>
        <p className="login-subtitle">Please sign in to continue</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-control" placeholder='Enter password' />
          </div> */}
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary login-button">
            Sign In
          </button>
        </form>
        <p className="login-hint text-sm text-gray">
          Hint: Try usernames like "Anand Kumar", "Olivia Rhye"
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
