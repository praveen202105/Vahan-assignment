import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    role: '',
    organizationName: '',
    organizationId: '',
    email: '',
    password: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { role, organizationName, organizationId, email, password } = formData;

      const res = await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
        role,
        organizationName: role === 'OWNER' ? organizationName : undefined,
        organizationId: role === 'TEAM_LEAD' ? parseInt(organizationId) : undefined,
      });

      // Reset form fields after successful submission
      setFormData({
        role: '',
        organizationName: '',
        organizationId: '',
        email: '',
        password: ''
      });

      if (res.status === 200) {
        // Show registration success alert
        setRegistrationSuccess(true);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">Select Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="OWNER">Owner</option>
              <option value="TEAM_LEAD">Team Leader</option>
            </select>
          </div>
          {formData.role === 'OWNER' && (
            <div className="mb-4">
              <label htmlFor="organizationName" className="block text-gray-700">Organization Name:</label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}
          {formData.role === 'TEAM_LEAD' && (
            <div className="mb-4">
              <label htmlFor="organizationId" className="block text-gray-700">Company ID:</label>
              <input
                type="text"
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}
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
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
