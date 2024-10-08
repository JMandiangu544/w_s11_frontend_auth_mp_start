import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh
    setError('');
    setMessage('');

    const apiUrl = isLogin
      ? 'http://localhost:3003/api/auth/login'
      : 'http://localhost:3003/api/auth/register';

    try {
      const response = await axios.post(apiUrl, { username, password });

      if (isLogin) {
        // If login succeeds, save the token and redirect
        localStorage.setItem('token', response.data.token);
        navigate('/stars'); // Navigate to Stars route
      } else {
        // On registration, show the welcome message
        setMessage(response.data.message);
      }
    } catch (err) {
      // Handle errors, show error message
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="container">
      <div aria-live="polite">{message}</div>
      <div aria-live="assertive" style={{ color: 'red' }}>{error}</div>
      <h3>{isLogin ? 'Login' : 'Register'}
        <button onClick={toggleFormMode}>
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
}