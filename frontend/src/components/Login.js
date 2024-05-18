import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let errorTimer;
    let tryAgainTimer;

    if (loginError) {
      // Display the error message for 2 seconds
      errorTimer = setTimeout(() => {
        setLoginError('');
        setShowTryAgain(true);

        // Display "Please try again" message for 2 seconds
        tryAgainTimer = setTimeout(() => {
          setShowTryAgain(false);
        }, 2000);
      }, 2000);
    }

    // Cleanup timers on component unmount or when loginError changes
    return () => {
      clearTimeout(errorTimer);
      clearTimeout(tryAgainTimer);
    };
  }, [loginError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const companyId = res.data.user.id;
      setEmail('');
      setPassword('');
      setLoginError('');
      Cookies.set('token', res.data.token);
      setLoginSuccess(true);
      console.log(companyId);

      // Show the success message for 2 seconds before navigating
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setLoginError(error.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {loginError && <div className="mb-4 text-red-500">{loginError}</div>}
          {showTryAgain && <div className="mb-4 text-yellow-500">Please try again</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        {loginSuccess && (
          <div className="mt-4 text-green-500 text-center">Login successful!</div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
