import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [role, setRole] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
        role,
        organizationName: role === 'OWNER' ? organizationName : undefined,
        organizationId: role === 'TEAM_LEAD' ? parseInt(organizationId) : undefined,
      });

      // Reset form fields after successful submission
      setRole('');
      setOrganizationName('');
      setOrganizationId('');
      setEmail('');
      setPassword('');
      
      // console.log(res.status);
      
      if (res.status === 200) {
        // Show registration success alert
        setRegistrationSuccess(true);
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.log(error.response.data.error);
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      console.error(error.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">Select Role:</label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="OWNER">Owner</option>
              <option value="TEAM_LEAD">Team Leader</option>
            </select>
          </div>
          {role === 'OWNER' &&
            <div className="mb-4">
              <label htmlFor="organizationName" className="block text-gray-700">Organization Name:</label>
              <input
                type="text"
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          }
          {role === 'TEAM_LEAD' &&
            <div className="mb-4">
              <label htmlFor="organizationId" className="block text-gray-700">Company ID:</label>
              <input
                type="text"
                id="organizationId"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          }
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}
        {registrationSuccess && (
          <div className="mt-4 text-green-500 text-center">Registration successful!</div>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;
