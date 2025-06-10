import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import api from '../services/apiservice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
      isLoggedInHere: 0,
    });

    console.log('Login API Response:', res.data); //for debug purpose

    const token = res.data.token; 
    const identity = process.env.REACT_APP_IDENTITY

    if (!token) {
      throw new Error('Missing token from login response');
    }
    const userData = {
      email: res.data.userDetails.email,
      token,
      identity,
    };

    login(userData);  
    navigate('/dashboard');
  } catch (err) {
    console.error('Login Error:', err);
    setError('Login failed: Check credentials or API response.');
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;