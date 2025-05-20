import { useState } from 'react';
import axios from '../api/axios';
import AuthService from '../services/AuthService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password });

    try {
      await AuthService.login(username, password);
      const profile = await AuthService.getProfile();
      console.log('Logged in as:', profile);
      alert(`Welcome ${profile.username}!`);

      // redirect to /notes
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Invalid credentials!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;