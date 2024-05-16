import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false); // State variable for login success
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      // Extract companyId from response data
      const companyId  = res.data.user.id;
      
      // Reset form fields after successful submission
      setEmail('');
      setPassword('');
      setLoginError('');

      // Store the token in cookies
      Cookies.set('token', res.data.token);

      // Set login success state to true
      setLoginSuccess(true);
      console.log(companyId)
      // Redirect to the page to get all employees with companyId as a parameter
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response.data.error);
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br /><br />
        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
        <button type="submit">Login</button>
      </form>
      {loginSuccess && (
        <div className="success-alert">Login successful!</div>
      )}
    </div>
  );
}

export default LoginForm;
